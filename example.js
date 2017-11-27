'use strict'
const got = require('got')
const resolveFromNpm = require('@pnpm/git-resolver').default

resolveFromNpm({
  pref: 'kevva/is-negative#16fd36fe96106175d02d066171c44e2ff83bc055'
}, { getJson })
.then(resolveResult => console.log(resolveResult))

function getJson (url, registry) {
  return got(url, {json: true})
    .then(response => response.body)
}
