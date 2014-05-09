var Cylon = require('cylon');
 
Cylon.robot({
  connection: { name: 'arduino', adaptor: 'firmata' , port: '/dev/ttyACM0' },
  devices: [
    { name: 'led', driver: 'led', pin: '13' },
    { name: 'makey', driver: 'makey-button', pin: 2 }
  ],
 
  work: function(my) {
    //my.button1.on('push', function() {
    //  //my.led.toggle();
    //  console.log("1");
    //});
    //my.button2.on('push', function() {
    //  //my.led.toggle();
    //  console.log("2");
    //});
    my.makey.on('push', function() {
			console.log("event 1");
    });
    my.makey.on('push', function() {
			console.log("event 2");
      my.led.toggle();
    });
  }
}).start();
