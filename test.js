
var sleepyhollow = require('./index');
var mrhyde = sleepyhollow();

// generate a large string of alphabetical characters
var len = 1e5, mod = 26, pad = 65;
var response = [];
for (var i = 0; i < len; i++) {
    var c = (i % mod) + pad;
    response += String.fromCharCode(c);
}

// when receiving a page command, navigate, render
mrhyde.on('page', function(url) {
    var page = require('webpage').create();
    page.open(url, function(status) {

        mrhyde.emit("open");
        mrhyde.emit("output", response);

        // test rendering
        page.render("render.png");
        mrhyde.emit("render");

        page.close();
    });
});

mrhyde.on('end', function() {
    phantom.exit();
});
