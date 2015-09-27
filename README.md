# jspm-dev-builder

A small module for running [jspm](http://www.jspm.io) development builds.

## Motivations

When you're working on small applications, one of the best features of jspm is that you don't need to run any form of watch task. jspm loads and transpiles everything in the browser, and in development this workflow works really well. However, when your app reaches a certain size the overhead of running everything in the browser leads to your app taking multiple seconds to refresh.

At this point, you can switch to bundling your application whenever you save a file to generate a large, unminified bundle file which you can give to your browser. This is made possible thanks to recent additions to jspm that enable builds to make use of a build cache. On an application with ~800 modules, we've seen the initial jspm build hit 6-7 seconds, but after a file change we see the app rebuild in ~0.5 seconds.

## Usage

```js
var DevBuilder = require('jspm-dev-builder');

var appDevBuilder = new DevBuilder({
  jspm: require('jspm'), // so you can use your local version of jspm
  inLoc: path.join('app', 'bootstrap.js'), // path to your app's entry point
  outLoc: path.join('client', 'app-bundle.js'), // where you want the output file
  logPrefix: 'jspm-app', // put at the beginning of log messages from dev builder
});
```

You can then call `appDevBuilder.build()` to generate a new build. If a file has changed and you need to rebuild, call `appDevBuilder.build('file-that-changed.js')`. This will cause the builder to invalidate the cache for the file that changed, and hence when a new build is generated it will have the new version of that file within it.

If you don't pass `DevBuilder` a version of jspm to use, it will use its own version, which is currently set at 0.16.10.

## Sample Output

Below is a CLI output from a watch task that is using `jspm-dev-builder` to generate a bundle.

```
jspm-app jspm build starting app/bootstrap.js
jspm-app jspm build finished 4911
Watching files!
File changed: app/routes/home/index/home-index.controller.js
jspm-app Deleting app-compiled/routes/home/index/home-index.controller.js from trace cache
jspm-app jspm build starting app/bootstrap.js
jspm-app jspm build finished 429
```