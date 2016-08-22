define(['exports', './aurelia-pal-nodejs'], function (exports, _aureliaPalNodejs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaPalNodejs).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaPalNodejs[key];
      }
    });
  });
});