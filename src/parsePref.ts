import got = require('got')
import git = require('graceful-git')
import HostedGit = require('hosted-git-info')
import url = require('url')

export type HostedPackageSpec = ({
  fetchSpec: string,
  hosted?: {
    type: string,
    user: string,
    project: string,
    committish: string,
    tarball (): string | void,
  },
  normalizedPref: string,
  gitCommittish: string | null,
  gitRange?: string,
})

const gitProtocols = new Set([
  'git',
  'git+http',
  'git+https',
  'git+rsync',
  'git+ftp',
  'git+file',
  'git+ssh',
])

export default async function parsePref (pref: string): Promise<HostedPackageSpec | null> {
  const hosted = HostedGit.fromUrl(pref)
  if (hosted) {
    return await fromHostedGit(hosted)
  }
  const colonsPos = pref.indexOf(':')
  if (colonsPos === -1) return null
  const protocol = pref.substr(0, colonsPos)
  if (protocol && gitProtocols.has(protocol.toLocaleLowerCase())) {
    const urlparse = url.parse(pref)
    if (!urlparse || !urlparse.protocol) return null
    const match = urlparse.protocol === 'git+ssh:' && matchGitScp(pref)
    if (match) {
      return {
        ...match,
        normalizedPref: pref,
      }
    }
    return {
      fetchSpec: urlToFetchSpec(urlparse),
      normalizedPref: pref,
      ...setGitCommittish(urlparse.hash != null ? urlparse.hash.slice(1) : ''),
    }
  }
  return null
}

function urlToFetchSpec (urlparse: url.Url) {
  if (urlparse.protocol) {
    urlparse.protocol = urlparse.protocol.replace(/^git[+]/, '')
  }
  delete urlparse.hash
  return url.format(urlparse)
}

async function fromHostedGit (hosted: any): Promise<HostedPackageSpec> { // tslint:disable-line
  let fetchSpec: string | null = null
  // try git/https url before fallback to ssh url

  const gitUrl = hosted.git({noCommittish: true})
  if (gitUrl) {
    try {
      await git(['ls-remote', '--exit-code', gitUrl, 'HEAD'], {retries: 0})
      fetchSpec = gitUrl
    } catch (e) {
      // ignore
    }
  }

  if (!fetchSpec) {
    const httpsUrl = hosted.https({noGitPlus: true, noCommittish: true})
    if (httpsUrl) {
      try {
        // when git ls-remote private repo, it asks for login credentials.
        // use HTTP HEAD request to test whether this is a private repo, to avoid login prompt.
        // this is very similar to yarn's behaviour.
        // npm instead tries git ls-remote directly which prompts user for login credentials.

        // HTTP HEAD on https://domain/user/repo, strip out ".git"
        const response = await got(httpsUrl.substr(0, httpsUrl.length - 4), {method: 'HEAD', followRedirect: false})
        if (response.statusCode === 200) {
          fetchSpec = httpsUrl
        }
      } catch (e) {
        // ignore
      }
    }
  }

  if (!fetchSpec) {
    // use ssh url for likely private repo
    fetchSpec = hosted.sshurl({noCommittish: true})
  }

  return {
    fetchSpec: fetchSpec!,
    hosted,
    normalizedPref: hosted.shortcut(),
    ...setGitCommittish(hosted.committish),
  }
}

function setGitCommittish (committish: string | null) {
  if (committish != null && committish.length >= 7 && committish.slice(0, 7) === 'semver:') {
    return {
      gitCommittish: null,
      gitRange: decodeURIComponent(committish.slice(7)),
    }
  }
  return {
    gitCommittish: committish === '' ? null : committish,
  }
}

function matchGitScp (spec: string) {
  // git ssh specifiers are overloaded to also use scp-style git
  // specifiers, so we have to parse those out and treat them special.
  // They are NOT true URIs, so we can't hand them to `url.parse`.
  //
  // This regex looks for things that look like:
  // git+ssh://git@my.custom.git.com:username/project.git#deadbeef
  //
  // ...and various combinations. The username in the beginning is *required*.
  const matched = spec.match(/^git\+ssh:\/\/([^:#]+:[^#]+(?:\.git)?)(?:#(.*))?$/i)
  return matched && !matched[1].match(/:[0-9]+\/?.*$/i) && {
    fetchSpec: matched[1],
    gitCommittish: matched[2] == null ? null : matched[2],
  }
}
