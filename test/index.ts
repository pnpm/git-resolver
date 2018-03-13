import test = require('tape')
import createResolveFromGit from '@pnpm/git-resolver'

const resolveFromGit = createResolveFromGit({})

test('resolveFromGit()', async t => {
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
