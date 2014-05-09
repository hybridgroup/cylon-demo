var Cylon = require('cylon');

Cylon.robot({
  name: 'digispark',
  connection: { name: 'digispark', adaptor: 'digispark' },
  devices: [
    { name: 'red', driver: 'led', pin: 0 },
    { name: 'blue', driver: 'led', pin: 2 },
  ],
  work: function(my) {
    every((1).second(), my.red.toggle);
  }
});

Cylon.api({ host: '0.0.0.0', port: '8080' });

Cylon.start();
