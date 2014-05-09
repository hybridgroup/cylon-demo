//leap_sphero.js
var Cylon = require('cylon');

Cylon.robot({
  connections: [
    { name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6437' },
    { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' }
  ],
  devices: [
    { name: 'leapmotion', driver: 'leapmotion', connection: 'leapmotion' },
    { name: 'sphero', driver: 'sphero', connection: 'sphero' }
  ],
  work: function(my) {
    var y = 0;
    var x = 0;
    my.sphero.setBackLED(255)

    my.leapmotion.on('hand', function(hand) {
      y = hand.palmY.fromScale(50, 200).toScale(0, 90) | 0;
      x = hand.palmX.fromScale(-30, 50).toScale(0, 90) | 0;
    });

    every((1).second(), function() {
      my.sphero.setRGB(Math.floor(Math.random() * 16777216));
    });
    
    every((0.01).second(), function() {
      if (x != 0) {
        if (x > 45) {
          my.sphero.roll(40, x.fromScale(45, 90).toScale(90, 180) | 0);
        } else {
          my.sphero.roll(40, x.fromScale(0, 45).toScale(270, 359) | 0);
        }
      } else {
        if (y > 45) {
          my.sphero.roll(40, y.fromScale(45, 90).toScale(0, 90) | 0);
        } else {
          my.sphero.roll(40, y.fromScale(0, 45).toScale(180, 270) | 0);
        }
      }
    });
  }
})

Cylon.start();
