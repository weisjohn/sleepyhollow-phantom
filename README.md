sleepyhollow-phantom
====================

PhantomJS binder for two-way communication with Node.js. An IPC library in two modules, used in conjunction with [sleepyhollow-node](https://github.com/weisjohn/sleepyhollow-node), via `stdin` and `stderr`. No `socket.io` or server-page hacks required.

### usage

To receive messages from Node.js, require and invoke `sleepyhollow`. This returns an `EventEmitter` instance which allows you to implement your own message passing system.

```
// this is PhantomJS code, not Node.js!

var sleepyhollow = require('./node_modules/sleepyhollow-phantom/index.js');
var mrhyde = sleepyhollow();

mrhyde.on('render', function(url) {
    var page = require('webpage').create();
    page.open(url, function(status) {
        page.render(url + ".png");
        mrhyde.emit("rendered");
        page.close();
    });
});

mrhyde.on('end', function() {
    phantom.exit();
});

```

[See the usage example for the corresponding Node.js code](https://github.com/weisjohn/sleepyhollow-node#usage).