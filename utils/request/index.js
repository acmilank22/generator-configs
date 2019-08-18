'use strict';

const rp = require('request-promise');
const ora = require('ora');

module.exports = url => {
  const spinner = ora();
  // spinner.start('Request\n');
  return rp(url)
    .then(res => {
      spinner.succeed(`Request Success - ${url}`);
      return res;
    })
    .catch(err => {
      const { name, message } = err;
      spinner.fail(`Request Error - ${url}. ${name}: ${message}`);
    });
};