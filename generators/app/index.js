'use strict';

const Generator = require('yeoman-generator');
const { yellow } = require('chalk');

const { base: baseQuestions, eslint: eslintQuestions } = require('./questions');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('prompt', {
      alias: 'p',
      type: Boolean,
      default: false
    });

    this.tips = (...args) => {
      this.log(yellow(...args));
    };

    this.deleteConfigFile = () => {
      const configFilePath = this.destinationPath('.yo-rc.json');
      this.fs.delete(configFilePath);
    };
  }

  initializing() {
    this.tips(yellow('initializing...'));
    const packageJsonFilePath = this.destinationPath('package.json');
    const hasPackageJsonFile = this.fs.exists(packageJsonFilePath);
    if (!hasPackageJsonFile) {
      this.spawnCommandSync('npm init');
    }
  }

  async prompting() {
    const { options, config } = this;
    const { prompt } = options;
    const { promptValues } = config.getAll();
    if (!prompt && promptValues) {
      return false;
    }

    this.deleteConfigFile();
    const { configs: baseAnswers } = await this.prompt(baseQuestions);
    const hasESLint = baseAnswers.includes('eslint');
    if (hasESLint) {
      await this.prompt(eslintQuestions);
    }
  }

  configuring() {
    this.tips('configuring...');
  }

  writing() {
    this.tips('writing...');
    const config = this.config.getAll();
    const { promptValues } = config;
    const { configs: baseAnswers } = promptValues;

    const hasEditorConfig = baseAnswers.includes('editorconfig');
    const hasPrettier = baseAnswers.includes('prettier');
    const hasESLint = baseAnswers.includes('eslint');
    const hasStylelint = baseAnswers.includes('stylelint');
    const hasLintStaged = baseAnswers.includes('lint-staged');
    const hasHTMLHint = baseAnswers.includes('htmlhint');
    const hasGitignore = baseAnswers.includes('gitignore');
    const hasGitattributes = baseAnswers.includes('gitattributes');
    const hasLicense = baseAnswers.includes('license');

    if (hasEditorConfig) {
      this.composeWith(require.resolve('../editorconfig'));
    }

    if (hasPrettier) {
      this.composeWith(require.resolve('../prettier'));
    }

    if (hasESLint) {
      this.composeWith(require.resolve('../eslint'));
    }

    if (hasStylelint) {
      this.composeWith(require.resolve('../stylelint'));
    }

    if (hasLintStaged) {
      //
    }

    if (hasHTMLHint) {
      //
    }

    if (hasGitignore) {
      //
    }

    if (hasGitattributes) {
      //
    }

    if (hasLicense) {
      //
    }
  }

  install() {
    this.tips('install...');
  }

  end() {
    this.tips('Thanks');
  }
};
