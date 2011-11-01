#!/bin/sh

echo 'Releasing Pipes 0.1.1'
rm pipes-*.js
cat js/lib/jquery.cookie.js js/lib/jquery.url.js js/lib/jquery.json-2.2.js js/pipe.js js/cohort.js js/capability.js > pipes-0.1.1.js
echo 'Done'
