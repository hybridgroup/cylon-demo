(function() {
  var Cylon;

  Cylon = require('cylon');

  Cylon.robot({
    connection: {
      name: 'arduino',
      adaptor: 'firmata',
      port: '/dev/ttyACM0'
    },
    device: {
      name: 'led',
      driver: 'led',
      pin: 13
    },
    work: function(my) {
      return every(1..second(), function() {
        return my.led.toggle();
      });
    }
  }).start();

}).call(this);
