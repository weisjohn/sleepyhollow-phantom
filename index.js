
var EventEmitter = require('./EventEmitter.js');

var stderr = require('system').stderr;
var stdin = require('system').stdin;

(function(window) {
    "use strict";

    function sleepyhollow() {

        // the modified event-emitter bridge
        var sleepyhollow = new EventEmitter();
        _emit = sleepyhollow.emit;

        // each message will get it's own ID
        var msgId = 0;

        sleepyhollow.emit = function(event, message) {
            if (!message) message = " ";
            msgId++;

            // local emit, for other subscribers
            _emit.apply(sleepyhollow, Array.prototype.slice.call(arguments, 0));

            // if this event is an ack, bolt
            if (event == "ack") return;

            // stringify and chunk out writes
            JSON.stringify(message)
                // create an array of strings each under 7936 characters
                // (8192 char limit minus 256 for meta and JSON overhead)
                .match(/.{1,7936}/g)
                .forEach(function(message, index, arr) {
                    write({
                        msgId: msgId,
                        // if there is more than one index, it's multipart
                        isMultipart: arr.length > 1,
                        // EOF there are no more indicies left to pass
                        isEof: (index == arr.length - 1),
                        event: event,
                        message: message
                    });
                });

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
        setInterval(function() { write({ "event" : "syn" }); }, 1e3);

        return sleepyhollow;
    }

    module.exports = sleepyhollow;

})(this);