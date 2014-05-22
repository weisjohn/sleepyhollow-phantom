
var sleepyhollow = require('./index');
var mrhyde = sleepyhollow();

mrhyde.on('page', function(url) {
    var page = require('webpage').create();
    page.open(url, function(status) {
        mrhyde.emit("open");
        page.render(url + ".png");
        mrhyde.emit("render");
        page.close();
    });
});

mrhyde.on('end', function() {
    phantom.exit();
});
