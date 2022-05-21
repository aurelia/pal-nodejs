# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.0.0-rc.1](https://github.com/aurelia/pal-nodejs/compare/2.0.0...3.0.0-rc.1) (2022-05-21)

* Update `jsdom` to version 19, close [#46](https://github.com/aurelia/pal-nodejs/issues/46)

<a name="2.0.0"></a>
# [2.0.0](https://github.com/aurelia/pal-nodejs/compare/1.2.0...2.0.0) (2020-02-28)


### Bug Fixes

* **platform:** type mismatch ([c823413](https://github.com/aurelia/pal-nodejs/commit/c823413))


### Features

* update jsdom v15.0.0 to improve compatibility of browser simulation ([dfc8b36](https://github.com/aurelia/pal-nodejs/commit/dfc8b36)), closes [aurelia/cli#1019](https://github.com/aurelia/cli/issues/1019)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/aurelia/pal-nodejs/compare/1.1.0...1.1.1) (2018-06-12)

### Bug Fixes

* **mutation-observer:** MutationObserver not handling changes to CharacterData.data

<a name="1.0.0-beta.3.3.0"></a>
# [1.0.0-beta.3.3.0](https://github.com/aurelia/pal-nodejs/compare/1.0.0-beta.3.2.0...1.0.0-beta.3.3.0) (2018-04-17)

### Features

* Updated to support new PAL methods and typings.

<a name="1.0.0-beta.3.2.0"></a>
# [1.0.0-beta.3.2.0](https://github.com/aurelia/pal-nodejs/compare/1.0.0-beta.3.1.0...1.0.0-beta.3.2.0) (2018-03-06)


### Features

* **performance:** update performance API ([1508a8b](https://github.com/aurelia/pal-nodejs/commit/1508a8b))



<a name="1.0.0-beta.3.1.0"></a>
# [1.0.0-beta.3.1.0](https://github.com/aurelia/pal-nodejs/compare/1.0.0-beta.3.0.0...1.0.0-beta.3.1.0) (2018-03-03)

### Features

* **dom:** add NodeList to global ([20ce260](https://github.com/aurelia/pal-nodejs/commit/20ce260))

### Bug Fixes

* **global:** add missing interface element to fix compile errors ([fa2bbd3](https://github.com/aurelia/pal-nodejs/commit/fa2bbd3))



<a name="1.0.0-beta.2.0.0"></a>
# [1.0.0-beta.2.0.0](https://github.com/aurelia/pal-nodejs/compare/1.0.0-beta.1.0.0...1.0.0-beta.2.0.0) (2017-08-22)


### Bug Fixes

* **whole-text:** remove unnecessary wholeText polyfill ([348a272](https://github.com/aurelia/pal-nodejs/commit/348a272))


### Features

* **dom:** add createTemplateElement ([8158b02](https://github.com/aurelia/pal-nodejs/commit/8158b02))
* **dom:** implement createAttribute ([e926bd9](https://github.com/aurelia/pal-nodejs/commit/e926bd9))
* **index:** add reset function ([a33a116](https://github.com/aurelia/pal-nodejs/commit/a33a116))
* **jsdom:** update jsdom ([d8e6239](https://github.com/aurelia/pal-nodejs/commit/d8e6239))



<a name="1.0.0-beta.1.0.0"></a>
# [1.0.0-beta.1.0.0](https://github.com/aurelia/pal-nodejs/compare/1.0.0-alpha.5...v1.0.0-beta.1.0.0) (2016-12-07)


### Bug Fixes

* **build:** correct spec require fix ([de0dca4](https://github.com/aurelia/pal-nodejs/commit/de0dca4))
* **index:** alias console.debug to console.log ([6eae254](https://github.com/aurelia/pal-nodejs/commit/6eae254))
* **index:** use proper objects for globalization ([06ad303](https://github.com/aurelia/pal-nodejs/commit/06ad303))
* **jsdom-whole-text:** polyfill actual Text class too ([bb2c0f8](https://github.com/aurelia/pal-nodejs/commit/bb2c0f8))
* **jsdom-whole-text:** use hasOwnProperty ([bf02c14](https://github.com/aurelia/pal-nodejs/commit/bf02c14))
* **nodejs-dom:** fallback to a dummy class for SVGElement ([e406710](https://github.com/aurelia/pal-nodejs/commit/e406710))
* **nodejs-global:** add the missing globals ([1f6e596](https://github.com/aurelia/pal-nodejs/commit/1f6e596))
* **nodejs-global:** remove XMLHttpRequest ([d20ffb0](https://github.com/aurelia/pal-nodejs/commit/d20ffb0))
* **typings:** updated types breaking the build ([e797969](https://github.com/aurelia/pal-nodejs/commit/e797969))
* **whole-text:** do not polyfill if implemented ([d497559](https://github.com/aurelia/pal-nodejs/commit/d497559))


### Features

* **index:** globalize returns global scope ([b1b001d](https://github.com/aurelia/pal-nodejs/commit/b1b001d))
* **index:** move isInitialized to aurelia-pal ([b7ce21a](https://github.com/aurelia/pal-nodejs/commit/b7ce21a))
* **nodejs-global:** add exported globalize function ([55c2ffd](https://github.com/aurelia/pal-nodejs/commit/55c2ffd))
* **whole-text:** add [@jdanyow](https://github.com/jdanyow)'s wholeText jsdom polyfill ([a414eb7](https://github.com/aurelia/pal-nodejs/commit/a414eb7))
