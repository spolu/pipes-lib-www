#!/bin/sh

echo 'Releasing Pipe 0.1.1'
rm pipe-*.js
cat js/lib/jquery.cookie.js js/lib/jquery.json-2.2.js js/bipsly.js js/pipe.js > pipe-0.1.1.js
echo 'Done'
