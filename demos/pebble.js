var Cylon = require('cylon');

Cylon.api({host: '10.22.25.22', port: '8080', ssl:  false});

Cylon.robot({
  name: 'pebble',
  connection: ,
  device: ,

  work: function(my) {
		var i = 0;
		every((1).second(), function(){
			my.pebble.message_queue().push(i++);
			console.log(i);
  	});
  }
});

Cylon.start();


var PebbleRobot = (function() {
  function PebbleRobot() {}

  PebbleRobot.prototype.connection = { name: 'pebble', adaptor: 'pebble' };
  PebbleRobot.prototype.device = { name: 'pebble', driver: 'pebble' };
  PebbleRobot.prototype.message = function(robot, msg) {
    robot.message_queue().push(msg);
  };
  PebbleRobot.prototype.work = function(me) {
    me.pebble.on('connect', function() { console.log("Pebble Connected!"); });
  };

  return PebbleRobot;
})();
