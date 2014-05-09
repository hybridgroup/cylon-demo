var Cylon = require('cylon'),
	Travis = require('travis-ci');

travis = new Travis({
  version: '2.0.0'
});

Cylon.robot({
  connection: { name: 'digispark', adaptor: 'digispark' },
  devices: [
    { name: 'red', driver: 'led', pin: 0 }, 
    { name: 'green', driver: 'led', pin: 1 }, 
    { name: 'blue', driver: 'led', pin: 2 }
  ],
  resetLeds: function(me) {
      me.blue.turnOff();
      me.red.turnOff();
      me.green.turnOff();
  },
  checkTravis: function(me) {
      var name, user;
      user = "hybridgroup";
      name = "cylon";
      //name = "broken-arrow";
      console.log("Checking repo " + user + "/" + name);
      me.blue.turnOn();
      travis.repos({
        owner_name: user,
        name: name
      }, function(err, res) {
        if (res.repo) {
          me.resetLeds(me);
          switch (res.repo.last_build_state) {
            case 'passed':
              return me.green.turnOn();
            case 'failed':
              return me.red.turnOn();
            default:
              return me.blue.turnOn();
          }
        } else {
          me.blue.turnOn();
        }
      });
  },
  work: function(me) {
    me.resetLeds(me);
    me.checkTravis(me);
    every((10).second(), function() {
      me.resetLeds(me);
      me.checkTravis(me);
    });
  }
}).start();
