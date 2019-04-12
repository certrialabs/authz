'use strict';

let process = require('process');
let child_process = require('child_process');
let options = ['mocha', '--check-leaks'];

if (process.version.match(/^v4|v5/)) {
  options.push('--harmony_proxies');
} else {
}

let subprocess = child_process.spawn('nyc', options,  { stdio: 'inherit' });

subprocess.on('close', (code) => {
  process.exit(code);
});
