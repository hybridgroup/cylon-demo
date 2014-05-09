var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' },
  devices: [
    { name: 'led', driver: 'led', pin: 13 },
    { name: 'makey', driver: 'makey-button', pin: 2 }
  ],

  work: function(my) {
    my.makey.on('push', function() {
      my.led.toggle();
    });
  }
});

Cylon.start();