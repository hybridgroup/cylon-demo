var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' },
  device: { name: 'sphero', driver: 'sphero' },

  work: function(me) {
    every((1).second(), function() {
      me.sphero.roll(60, Math.floor(Math.random() * 360));
    });  
    every((0.5).second(), function() {
      my.sphero.setRGB(Math.floor(Math.random() * 16777216));
    });
  }
});

Cylon.start();