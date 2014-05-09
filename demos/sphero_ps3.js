var Cylon = require('cylon');

Cylon.robot({
  connections: [
    { name: 'joystick', adaptor: 'joystick', controller: 'dualshock3' },
    { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' }
  ],
  devices: [
    { name: 'controller', driver: 'dualshock3' },
    { name: 'sphero', driver: 'sphero', connection: 'sphero' }
  ],

  work: function(my) {
    var calibrate = false;
    var speed = 0;
    var dir = 0;

    my.controller.on("triangle:press", function(button) {
      my.sphero.startCalibration();
      calibrate = true;
    });

    my.controller.on("right:move", function(pos) {
      var x = pos.x;
      var y = pos.y;
      if (calibrate == true) {
        my.sphero.finishCalibration();
        calibrate = false;
      }
      my.sphero.setBackLED(255)
      if ((x < 140 && x > 120) && (y < 140 && y > 120)) {
        speed = 0;
      }

      if ( y < 5 && (x > 110 && x <= 255) ) {
        dir = x.fromScale(130, 255).toScale(0, 90) | 0
        speed = 60;
      } else if ( x >= 250 && (y > 1 && y <= 255) ) {
        dir = y.fromScale(0, 255).toScale(90, 180) | 0
        speed = 60;
      } else if ( y >= 250 && (x > 1 && x <= 255) ) {
        dir = (~x & 0xff).fromScale(0, 255).toScale(180, 270) | 0
        speed = 60;
      } else if ( x  < 5 && (y > 1 && y <= 255) ) {
        dir = (~y & 0xff).fromScale(0, 255).toScale(270, 359) | 0
        speed = 60;
      }
    });

    every((1).second(), function() {
      my.sphero.setRGB(Math.floor(Math.random() * 16777216));
    });
    
    every((0.01).second(), function() {
      my.sphero.roll(speed, dir);
    });
  }
});

Cylon.start();