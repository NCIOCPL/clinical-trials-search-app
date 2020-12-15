const JSDOMEnvironment = require("jest-environment-jsdom-fourteen");

module.exports = class JSDOMEnvironmentGlobal extends JSDOMEnvironment {
  constructor(config) {
    super(config);

    this.global.jsdom = this.dom;
  }

  teardown() {
    this.global.jsdom = null;

    return super.teardown();
  }
};