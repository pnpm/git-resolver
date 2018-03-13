import test = require('tape')
import createResolveFromGit from '@pnpm/git-resolver'

const resolveFromGit = createResolveFromGit({})

test('resolveFromGit() with commit', async t => {
  const resolveResult = await resolveFromGit({pref: 'zkochan/is-negative#163360a8d3ae6bee9524541043197ff356f8ed99'})
  t.deepEqual(resolveResult, {
    id: 'github.com/zkochan/is-negative/163360a8d3ae6bee9524541043197ff356f8ed99',
    normalizedPref: 'github:zkochan/is-negative#163360a8d3ae6bee9524541043197ff356f8ed99',
    resolution: {
      tarball: 'https://codeload.github.com/zkochan/is-negative/tar.gz/163360a8d3ae6bee9524541043197ff356f8ed99'
    }
  })
  t.end()
})

test('resolveFromGit() with no commit', async t => {
  const resolveResult = await resolveFromGit({pref: 'zkochan/is-negative'})
  t.deepEqual(resolveResult, {
    id: 'github.com/zkochan/is-negative/1d7e288222b53a0cab90a331f1865220ec29560c',
    normalizedPref: 'github:zkochan/is-negative',
    resolution: {
      tarball: 'https://codeload.github.com/zkochan/is-negative/tar.gz/1d7e288222b53a0cab90a331f1865220ec29560c'
    }
  })
  t.end()
})

test('resolveFromGit() with branch', async t => {
  const resolveResult = await resolveFromGit({pref: 'zkochan/is-negative#canary'})
  t.deepEqual(resolveResult, {
    id: 'github.com/zkochan/is-negative/4c39fbc124cd4944ee51cb082ad49320fab58121',
    normalizedPref: 'github:zkochan/is-negative#canary',
    resolution: {
      tarball: 'https://codeload.github.com/zkochan/is-negative/tar.gz/4c39fbc124cd4944ee51cb082ad49320fab58121'
    }
  })
  t.end()
})

test('resolveFromGit() with tag', async t => {
  const resolveResult = await resolveFromGit({pref: 'zkochan/is-negative#2.0.1'})
  t.deepEqual(resolveResult, {
    id: 'github.com/zkochan/is-negative/6dcce91c268805d456b8a575b67d7febc7ae2933',
    normalizedPref: 'github:zkochan/is-negative#2.0.1',
    resolution: {
      tarball: 'https://codeload.github.com/zkochan/is-negative/tar.gz/6dcce91c268805d456b8a575b67d7febc7ae2933'
    }
  })
  t.end()
})

test('resolveFromGit() with strict semver', async t => {
  const resolveResult = await resolveFromGit({pref: 'zkochan/is-negative#semver:1.0.0'})
  t.deepEqual(resolveResult, {
    id: 'github.com/zkochan/is-negative/163360a8d3ae6bee9524541043197ff356f8ed99',
    normalizedPref: 'github:zkochan/is-negative#semver:1.0.0',
    resolution: {
      tarball: 'https://codeload.github.com/zkochan/is-negative/tar.gz/163360a8d3ae6bee9524541043197ff356f8ed99'
    }
  })
  t.end()
})

test('resolveFromGit() with range semver', async t => {
  const resolveResult = await resolveFromGit({pref: 'zkochan/is-negative#semver:^1.0.0'})
  t.deepEqual(resolveResult, {
    id: 'github.com/zkochan/is-negative/9a89df745b2ec20ae7445d3d9853ceaeef5b0b72',
    normalizedPref: 'github:zkochan/is-negative#semver:^1.0.0',
    resolution: {
      tarball: 'https://codeload.github.com/zkochan/is-negative/tar.gz/9a89df745b2ec20ae7445d3d9853ceaeef5b0b72'
    }
  })
  t.end()
})

test('resolveFromGit() fails when ref not found', async t => {
  try {
    const r = await resolveFromGit({pref: 'zkochan/is-negative#bad-ref'})
    t.fail()
  } catch (err) {
    t.equal(err.message, 'Could not resolve bad-ref to a commit of git://github.com/zkochan/is-negative.git.', 'throws the expected error message')
    t.end()
  }
})

test('resolveFromGit() fails when semver ref not found', async t => {
  try {
    const r = await resolveFromGit({pref: 'zkochan/is-negative#semver:^100.0.0'})
    t.fail()
  } catch (err) {
    t.equal(err.message, 'Could not resolve ^100.0.0 to a commit of git://github.com/zkochan/is-negative.git. Available versions are: 1.0.0, 1.0.1, 2.0.0, 2.0.1, 2.0.2, 2.1.0', 'throws the expected error message')
    t.end()
  }
})
