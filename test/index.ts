import test = require('tape')
import resolveFromGit from '@pnpm/git-resolver'
import got = require('got')

function getJson (url: string, registry: string) {
  return got(url, {json: true})
    .then((response: any) => response.body)
}

test('resolveFromGit()', async t => {
  const resolveResult = await resolveFromGit({pref: 'kevva/is-negative#16fd36fe96106175d02d066171c44e2ff83bc055'}, {getJson})
  t.deepEqual(resolveResult, {
    id: 'github.com/kevva/is-negative/16fd36fe96106175d02d066171c44e2ff83bc055',
    normalizedPref: 'github:kevva/is-negative#16fd36fe96106175d02d066171c44e2ff83bc055',
    resolution: {
      tarball: 'https://codeload.github.com/kevva/is-negative/tar.gz/16fd36fe96106175d02d066171c44e2ff83bc055'
    }
  })
  t.end()
})
