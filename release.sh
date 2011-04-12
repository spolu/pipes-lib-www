#!/bin/sh

echo 'Releasing Bipsly 0.1.1'
rm bipsly-*.js
cat js/lib/jquery.cookie.js js/lib/jquery.json-2.2.js js/bipsly.js js/pipe.js js/cohort.js > bipsly-0.1.1.js
echo 'Done'
