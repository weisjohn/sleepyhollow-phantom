
var EventEmitter = require('./EventEmitter.js');

var stderr = require('system').stderr;
var stdin = require('system').stdin;

(function(window) {
    "use strict";

    function sleepyhollow() {

        // the modified event-emitter bridge
        var sleepyhollow = new EventEmitter();
        _emit = sleepyhollow.emit;

		var msgId = 0;	//each message will get it's own message ID for this instance
		sleepyhollow.emit = function(event, message) {
			if(!message)message=' ';

			msgId++; //increment the id ctr

			message
				.match(/.{1,7936}/g)   						// create an array of strings each under 7936 characters (8192 char limit minus 256 for meta data and JSON syntax overhead)
				.forEach(function(msg,i,o){ 				// vvv iterate vvv
					
					var isMultipart = o.length>1; 			// it's multipart if there is more than one index
					var isEof = (i==o.length-1)?true:false; // mark as EOF if there are no more indicies left to pass
					
					if (event !== "ack") write({ msgId: msgId, isMultipart: isMultipart, isEof: isEof, event: event, message: msg });
					_emit.apply(sleepyhollow, Array.prototype.slice.call(arguments, 0));
				
				})
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