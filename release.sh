#!/bin/sh

echo 'Releasing Pipe 0.1.0'
cat js/jquery.json-2.2.js js/pipe.js js/jquery.cookie.js > pipe-0.1.0.js
echo 'Done'
