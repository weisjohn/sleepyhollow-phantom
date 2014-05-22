
var sleepyhollow = require('../index');
var mrhyde = sleepyhollow();

var renders = 0;
mrhyde.on('render', function(url) {
    var page = require('webpage').create();
    page.open(url, function(status) {
        renders++;
        page.render("render." + renders + ".png");
        mrhyde.emit("rendered");
        page.close();
    });
});

mrhyde.on('end', function() { phantom.exit(); });
