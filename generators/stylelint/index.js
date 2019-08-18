'use strict';

const Generator = require('yeoman-generator');

const { extendDevDependencies } = require('../../utils/package-json');
const { writeObjectModuleJS } = require('../../utils/fs');
let config = require('./rules');

function getPackages({ prettier }) {
  let packages = ['stylelint', 'stylelint-config-standard'];
  if (prettier) {
    packages = [...packages, 'stylelint-config-prettier', 'stylelint-prettier'];
  }
  return packages;
}

function integratePrettier({ config }) {
  let { extends: extendsAlias = [] } = config;
  extendsAlias.push('stylelint-prettier/recommended');
  return config;
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async writing() {
    const { promptValues } = this.config.getAll();
    const { configs: baseAnswers } = promptValues;
    const hasPrettier = baseAnswers.includes('prettier');

    const packageNames = getPackages({ prettier: hasPrettier });
    const fileName = 'stylelint.config.js';

    await extendDevDependencies({ context: this, packageNames });
    config = integratePrettier({ config });
    writeObjectModuleJS({ context: this, fileName, object: config });
  }
};