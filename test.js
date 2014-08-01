
var sleepyhollow = require('./index');
var mrhyde = sleepyhollow();

mrhyde.on('page', function(url) {
    var page = require('webpage').create();
    page.open(url, function(status) {
        mrhyde.emit("open");
		mrhyde.emit("output",page.content);
        page.render("render.png");
        mrhyde.emit("render");
        page.close();
    });
});

mrhyde.on('end', function() {
    phantom.exit();
});
