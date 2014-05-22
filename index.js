
var EventEmitter = require('./EventEmitter.js');

var stderr = require('system').stderr;
var stdin = require('system').stdin;

(function(window) {
    "use strict";

    function _sleepyhollow() {

        // the modified event-emitter bridge
        var sleepyhollow = new EventEmitter();
        _emit = sleepyhollow.emit;
        sleepyhollow.emit = function(event, message) {
            if (event !== "ack") write({ event: event, message : message });
            _emit.apply(sleepyhollow, Array.prototype.slice.call(arguments, 0));
        }

        // custom write <> read bridge
        function write(obj) {
            stderr.write(JSON.stringify(obj) + "\n");
            if (obj.event !== "ack") read();
        }

        function read() {
            var data = stdin.readLine();
            try { data.split("\v").forEach(_read); }
            catch (e) { throw new Error(data); }
        }

        function _read(data) { return _readLine(JSON.parse(data)); }
        function _readLine(obj) {
            if (obj.event !== "ack") write({ event: "ack", message: obj });
            _emit.apply(sleepyhollow, [obj.event, obj.message]);
        }

        // minimal writing to make sure the Node side doesn't have to buffer
        setInterval(function() { write({ "event" : "syn" }); }, 1e2);

        return sleepyhollow;
    }

    return exports = (module || {}).exports = _sleepyhollow;

})(this);