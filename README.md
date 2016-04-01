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
  expression: path.join('app', 'bootstrap.js'), // path to your app's entry point
  outLoc: path.join('client', 'app-bundle.js'), // where you want the output file
  logPrefix: 'jspm-app', // put at the beginning of log messages from dev builder
  buildOptions: {
    sfx: false, // if the build should be self executing
    // below options are passed straight through to the builder
    // the values shown are the defaults
    minify: false,
    mangle: false,
    sourceMaps: false,
    lowResSourceMaps: false,
  }
});
```

You can then call `appDevBuilder.build()` to generate a new build. If a file has changed and you need to rebuild, call `appDevBuilder.build('file-that-changed.js')`. This will cause the builder to invalidate the cache for the file that changed, and hence when a new build is generated it will have the new version of that file within it.

If you don't pass `DevBuilder` a version of jspm to use, it will use its own version, which is currently set at 0.16.12. Note that in order for the cache invalidation to work as expected, you **must be using jspm 0.16.12 or newer**. If you are stuck on an older version, you'll have to override `DevBuilder.prototype.removeFromTrace`.

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

## Changelog

#### 0.4.0
- add logging of `jspm.version`
- update to latest stable jspm (0.16.32)

#### 0.3.2
- add message about SFX cache invalidation being buggy that links to https://github.com/jackfranklin/jspm-dev-builder/issues/9.

#### 0.3.1
- updated deprecated calls to the builder. Added more messaging during cache invalidation. More examples - for SFX as well.

#### 0.3.0
- fixed the build function creating a new instance each time, and hence ignoring the cache - thanks @OrKoN for the PR

#### 0.2.0
- renamed `inLoc` to `expression`
- added `buildOptions` which are passed through to SystemJS-builder
- added `buildOptions.sfx` to turn on self executing bundling
- upgraded to jspm 0.16.12, and use the new SystemJS-Builder cache invalidation

#### 0.1.0
- initial release

