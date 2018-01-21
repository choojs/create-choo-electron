# create-choo-electron [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Create a fresh Choo Electron application.

Development kindly funded by [nearForm](http://nearform.com/opensource).

## Features
- Zero configuration.
- Ready to be deployed out of the box.
- Low footprint UI using [Choo frontend framework](https://github.com/choojs/choo).

## Usage

```sh
$ npx create-choo-electron <project-directory>
```

Then, once your new choo-electron app has installed itself, running the app in dev-mode is a two step process requiring two separate terminal windows. In the first terminal window run bankai with the run dev command:

```bash
  >npm run dev
```

Then in the second terminal run electron:

```bash
  >npm start
```

Now you should have your development environment setup and read to go! Bankai will reload automagically, however to see your changes in electron you will need to reload the electron window with ```Ctrl-r```. Chooohooo! :)

## API
```txt
  $ create-choo-electron <project-directory> [options]

  Options:

    -h, --help        print usage
    -v, --version     print version
    -q, --quiet       don't output any logs

  Examples:

    Create a new Choo Electron application
    $ create-choo-electron

  Running into trouble? Feel free to file an issue:
  https://github.com/choojs/create-choo-electron/issues/new

  Do you enjoy using this software? Become a backer:
  https://opencollective.com/choo
```

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/create-choo-electron.svg?style=flat-square
[3]: https://npmjs.org/package/create-choo-electron
[4]: https://img.shields.io/travis/choojs/create-choo-electron/master.svg?style=flat-square
[5]: https://travis-ci.org/choojs/create-choo-electron
[6]: https://img.shields.io/codecov/c/github/choojs/create-choo-electron/master.svg?style=flat-square
[7]: https://codecov.io/github/choojs/create-choo-electron
[8]: http://img.shields.io/npm/dm/create-choo-electron.svg?style=flat-square
[9]: https://npmjs.org/package/create-choo-electron
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
