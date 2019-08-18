'use strict';

const Generator = require('yeoman-generator');

const { copyTemplateFiles } = require('../../utils/fs');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  writing() {
    const fileNames = ['.editorconfig'];
    copyTemplateFiles({ context: this, fileNames });
  }
};