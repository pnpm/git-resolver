> this package was moved to https://github.com/pnpm/pnpm

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
const createResolveFromNpm = require('@pnpm/git-resolver').default

const resolveFromNpm = createResolveFromNpm({})

resolveFromNpm({
  pref: 'kevva/is-negative#16fd36fe96106175d02d066171c44e2ff83bc055'
})
.then(resolveResult => console.log(JSON.stringify(resolveResult, null, 2)))
//> {
//    "id": "github.com/kevva/is-negative/16fd36fe96106175d02d066171c44e2ff83bc055",
//    "normalizedPref": "github:kevva/is-negative#16fd36fe96106175d02d066171c44e2ff83bc055",
//    "resolution": {
//      "tarball": "https://codeload.github.com/kevva/is-negative/tar.gz/16fd36fe96106175d02d066171c44e2ff83bc055"
//    },
//    "resolvedVia": "git-repository"
//  }
```
<!--/@-->

## License

[MIT](./LICENSE) © [Zoltan Kochan](https://www.kochan.io/)
