var exec = require('child_process').exec
var dedent = require('dedent')
var mkdirp = require('mkdirp')
var path = require('path')
var pump = require('pump')
var fs = require('fs')

var TRAIN = '🚂🚋🚋'

exports.mkdir = function (dir, cb) {
  mkdirp(dir, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dir))
    fs.readdir(dir, function (err, files) {
      if (err) return cb(new Error('Could not read directory ' + dir))
      if (files.length) return cb(new Error('Directory contains files. This might create conflicts.'))
      cb()
    })
  })
}

exports.writePackage = function (dir, cb) {
  var filename = path.join(dir, 'package.json')
  var name = path.basename(dir)
  var file = dedent`
  {
    "name": "${name}",
    "version": "1.0.0",
    "private": true,
    "main": "main.js",
    "scripts": {
      "build": "bankai build && build",
      "dev": "bankai start index.js",
      "inspect": "bankai inspect index.js",
      "pack": "bankai build && build --dir",
      "start": "cross-env NODE_ENV=development electron main.js",
      "test": "standard && test-deps",
      "test-deps": "dependency-check . && dependency-check . --extra --no-dev -i tachyons"
    },
    "build": {
      "appId": "${name}",
      "files": [
        "**/*"
      ],
      "win": {
        "target": [
          "squirrel"
        ]
      }
    }
  }
  `
  write(filename, file, cb)
}

exports.writeIgnore = function (dir, cb) {
  var filename = path.join(dir, '.gitignore')
  var file = dedent`
    node_modules/
    .nyc_output/
    coverage/
    dist/
    tmp/
    npm-debug.log*
    .DS_Store
  `

  write(filename, file, cb)
}

exports.writeReadme = function (dir, cb) {
  var filename = path.join(dir, 'README.md')
  var name = path.basename(dir)
  var file = dedent`
    # ${name}
    A very cute Electron app

    ## Routes
    Route              | File               | Description                     |
    -------------------|--------------------|---------------------------------|
    \`/\`              | \`views/main.js\`  | The main view
    \`/*\`             | \`views/404.js\`   | Display unhandled routes

    ## Commands
    Command                | Description                                      |
    -----------------------|--------------------------------------------------|
    \`$ npm start\`        | Start the Electron process
    \`$ npm test\`         | Lint, validate deps & run tests
    \`$ npm run build\`    | Compile all files into \`dist/\`
    \`$ npm run dev\`      | Start the development server
    \`$ npm run inspect\`  | Inspect the bundle's dependencies
  `

  write(filename, file, cb)
}

exports.writeHtml = function (dir, cb) {
  var filename = path.join(dir, 'index.html')
  var file = dedent`
    <!DOCTYPE html>
    <html dir="ltr" lang="en">
      <head>
        <meta charset="utf-8">
        <meta content="width=device-width,initial-scale=1" name="viewport">
        <link rel="preload" as="style" href="http://localhost:8080/bundle.css" onload="this.rel='stylesheet'">
        <script defer src="http://localhost:8080/bundle.js"></script>
      </head>
      <body></body>
    </html>
  `

  write(filename, file, cb)
}

exports.writeIndex = function (dir, cb) {
  var filename = path.join(dir, 'index.js')
  var file = dedent`
    var css = require('sheetify')
    var choo = require('choo')

    css('tachyons')

    var app = choo()
    if (process.env.NODE_ENV !== 'production') {
      app.use(require('choo-devtools')())
    }

    app.route('/', require('./views/main'))
    app.route('/*', require('./views/404'))

    if (!module.parent) app.mount('body')
    else module.exports = app
  `

  write(filename, file, cb)
}

exports.writeMain = function (dir, cb) {
  var filename = path.join(dir, 'main.js')
  var name = path.basename(dir)
  var file = dedent`
    var resolvePath = require('electron-collection/resolve-path')
    var defaultMenu = require('electron-collection/default-menu')
    var electron = require('electron')

    var BrowserWindow = electron.BrowserWindow
    var Menu = electron.Menu
    var app = electron.app

    var win

    var windowStyles = {
      width: 800,
      height: 1000,
      titleBarStyle: 'hidden-inset',
      minWidth: 640,
      minHeight: 395
    }

    app.setName('${name}')

    var shouldQuit = app.makeSingleInstance(createInstance)
    if (shouldQuit) app.quit()

    app.on('ready', function () {
      win = new BrowserWindow(windowStyles)
      win.loadURL('file://' + resolvePath('./index.html'))

      win.webContents.on('did-finish-load', function () {
        win.show()
        var menu = Menu.buildFromTemplate(defaultMenu(app, electron.shell))
        Menu.setApplicationMenu(menu)
        if (process.env.NODE_ENV === 'development') {
          win.webContents.openDevTools({ mode: 'detach' })
        }
      })

      win.on('closed', function () {
        win = null
      })
    })

    app.on('window-all-closed', function () {
      app.quit()
    })

    function createInstance () {
      if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
      }
    }
  `

  write(filename, file, cb)
}

exports.writeNotFoundView = function (dir, cb) {
  var dirname = path.join(dir, 'views')
  var filename = path.join(dirname, '404.js')
  var file = dedent`
    var html = require('choo/html')

    var TITLE = '${TRAIN} - route not found'

    module.exports = view

    function view (state, emit) {
      if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
      return html\`
        <body class="sans-serif">
          <h1 class="f-headline pa3 pa4-ns">
            404 - route not found
          </h1>
          <a href="/" class="link black underline">
            Back to main
          </a>
        </body>
      \`
    }
  `

  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    write(filename, file, cb)
  })
}

exports.writeMainView = function (dir, cb) {
  var dirname = path.join(dir, 'views')
  var filename = path.join(dirname, 'main.js')
  var file = dedent`
    var html = require('choo/html')

    var TITLE = '${TRAIN}'

    module.exports = view

    function view (state, emit) {
      if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
      return html\`
        <body class="sans-serif">
          <h1 class="f-headline pa3 pa4-ns">
            Choo choo!
          </h1>
        </body>
      \`
    }
  `

  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    write(filename, file, cb)
  })
}

exports.writeIcon = function (dir, cb) {
  var iconPath = path.join(__dirname, 'assets/icon.png')
  var dirname = path.join(dir, 'assets')
  var filename = path.join(dirname, 'icon.png')
  mkdirp(dirname, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dirname))
    var source = fs.createReadStream(iconPath)
    var sink = fs.createWriteStream(filename)
    pump(source, sink, function (err) {
      if (err) return cb(new Error('Could not write file ' + filename))
      cb()
    })
  })
}

exports.install = function (dir, packages, cb) {
  packages = packages.join(' ')
  var cmd = 'npm install --save --cache-min Infinity --loglevel error ' + packages
  var popd = pushd(dir)
  exec(cmd, function (err) {
    if (err) return cb(new Error(cmd))
    popd()
    cb()
  })
}

exports.devInstall = function (dir, packages, cb) {
  packages = packages.join(' ')
  var cmd = 'npm install --save-dev --cache-min Infinity --loglevel error ' + packages
  var popd = pushd(dir)
  exec(cmd, function (err) {
    if (err) return cb(new Error(cmd))
    popd()
    cb()
  })
}

exports.createGit = function (dir, message, cb) {
  var init = 'git init'
  var add = 'git add -A'
  var config = 'git config user.email'
  var commit = 'git commit -m "' + message + '"'

  var popd = pushd(dir)
  exec(init, function (err) {
    if (err) return cb(new Error(init))

    exec(add, function (err) {
      if (err) return cb(new Error(add))

      exec(config, function (err) {
        if (err) return cb(new Error(config))

        exec(commit, function (err) {
          if (err) return cb(new Error(commit))
          popd()
          cb()
        })
      })
    })
  })
}

function pushd (dir) {
  var prev = process.cwd()
  process.chdir(dir)
  return function popd () {
    process.chdir(prev)
  }
}

function write (filename, file, cb) {
  fs.writeFile(filename, file, function (err) {
    if (err) return cb(new Error('Could not write file ' + filename))
    cb()
  })
}
