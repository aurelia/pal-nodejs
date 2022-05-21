<p>
  <a href="https://aurelia.io/" target="_blank">
    <img alt="Aurelia" src="https://aurelia.io/styles/images/aurelia.svg">
  </a>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm Version](https://img.shields.io/npm/v/aurelia-templating-resources.svg)](https://www.npmjs.com/package/aurelia-templating-resources)
![ci](https://github.com/aurelia/templating-resources/actions/workflows/main.yml/badge.svg)
[![Discourse status](https://img.shields.io/discourse/https/meta.discourse.org/status.svg)](https://discourse.aurelia.io)
[![Twitter](https://img.shields.io/twitter/follow/aureliaeffect.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=aureliaeffect)
[![Discord Chat](https://img.shields.io/discord/448698263508615178.svg)](https://discord.gg/RBtyM6u)

# aurelia-pal-nodejs

This library is part of the [Aurelia](http://www.aurelia.io/) platform and contains the node-specific implementation of the platform abstraction layer.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.aurelia.io/) and [our email list](http://eepurl.com/ces50j). We also invite you to [follow us on twitter](https://twitter.com/aureliaeffect). If you have questions look around our [Discourse forums](https://discourse.aurelia.io/), chat in our [community on Discord](https://discord.gg/RBtyM6u) or use [stack overflow](http://stackoverflow.com/search?q=aurelia). Documentation can be found [in our developer hub](http://aurelia.io/docs).

## Platform Support

This library can be used in **NodeJS**.

# Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
3. To test the code, run:

  ```shell
  npm test
  ```
4. To build the code, run:

  ```shell
  npm run build
  ```
5. You will find the compiled code in the `dist` folder in CommonJS module format.

# Acknowledgement

This software used a snippet borrowed from [browser-env](https://github.com/lukechilds/browser-env).
