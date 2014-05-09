var Cylon = require('cylon');

//Cylon.api({ host: '0.0.0.0', port: '8080' });
Cylon.api({ host: '192.168.1.4', port: '8080' });

var digisparkRobot = {
  connection: { name: 'digispark', adaptor: 'digispark' },
  devices: [
		{ name: 'red', driver: 'led', pin: 0 },
  	{ name: 'blue', driver: 'led', pin: 2 },
	],
  work: function(my) {
    return every(1..second(), function() {
      return my.red.toggle();
    });
  }
}

var robot = Object.create(digisparkRobot);
robot.name = "digispark";
Cylon.robot(robot);
Cylon.start();
