# @pnpm/git-resolver

> Resolver for git-hosted packages

<!--@shields('npm', 'travis')-->
[![npm version](https://img.shields.io/npm/v/@pnpm/git-resolver.svg)](https://www.npmjs.com/package/@pnpm/git-resolver) [![Build Status](https://img.shields.io/travis/pnpm/git-resolver/master.svg)](https://travis-ci.org/pnpm/git-resolver)
<!--/@-->

## Install

Install it via npm.

    npm install @pnpm/git-resolver

## Usage

<!--@example('./example.js')-->
```js
'use strict'
const got = require('got')
const createResolveFromNpm = require('@pnpm/git-resolver').default

const resolveFromNpm = createResolveFromNpm({getJson})

resolveFromNpm({
  pref: 'kevva/is-negative#16fd36fe96106175d02d066171c44e2ff83bc055'
}, { getJson })
.then(resolveResult => console.log(resolveResult))
//> { id: 'github.com/kevva/is-negative/16fd36fe96106175d02d066171c44e2ff83bc055',
//    normalizedPref: 'github:kevva/is-negative#16fd36fe96106175d02d066171c44e2ff83bc055',
//    resolution: { tarball: 'https://codeload.github.com/kevva/is-negative/tar.gz/16fd36fe96106175d02d066171c44e2ff83bc055' } }

function getJson (url, registry) {
  return got(url, {json: true})
    .then(response => response.body)
}
```
<!--/@-->

## License

[MIT](./LICENSE) © [Zoltan Kochan](https://www.kochan.io/)
