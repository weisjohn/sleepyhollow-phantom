
var sleepyhollow = require('../index.js');
var mrhyde = sleepyhollow();

mrhyde.on('render', function(url) {
    var page = require('webpage').create();
    page.open(url, function(status) {

        mrhyde.emit("log", { "status" : status });

        page.render(url.replace(/[\/:]/g, "") + ".png");
        mrhyde.emit("rendered");
        page.close();
    });
});

mrhyde.on('end', function() {
    phantom.exit();
});