var Cylon = require('cylon');

var bots = [
  { port: '/dev/rfcomm0', name: 'Thelma' },
  { port: '/dev/rfcomm1', name: 'Louise' },
  { port: '/dev/rfcomm2', name: 'Grace' },
  { port: '/dev/rfcomm3', name: 'Ada' }
];

var Green = 0x00FF00;
var Red = 0xFF0000;

var ConwayRobot = (function() {
  function ConwayRobot() {}

  ConwayRobot.prototype.connection = { name: 'Sphero', adaptor: 'sphero' };
  ConwayRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  ConwayRobot.prototype.born = function() {
    this.contacts = 0;
    this.age = 0;
    this.alive = true;
    this.life();
    this.move();
  };

  ConwayRobot.prototype.move = function() {
    this.sphero.roll(60, Math.floor(Math.random() * 360));
  };

  ConwayRobot.prototype.life = function() {
    this.alive = true;
    this.sphero.setRGB(Green);
  };

  ConwayRobot.prototype.death = function() {
    this.alive = false;
    this.sphero.setRGB(Red);
    this.sphero.stop();
  };

  ConwayRobot.prototype.enoughContacts = function() {
    return (this.contacts >= 2 && this.contacts < 7);
  };

  ConwayRobot.prototype.birthday = function() {
    this.age += 1;

    console.log("Happy birthday, " + this.name + ". You are " + this.age + " and had " + this.contacts + " contacts.");

    if (this.enoughContacts()) {
      if (this.alive == false) { this.rebirth(); }
    } else {
      this.death();
    }

    this.contacts = 0;
  };

  ConwayRobot.prototype.work = function(me) {
    me.born();

    me.sphero.on('collision', function() {
      this.contacts += 1;
    });

    every((3).seconds(), function() {
      if (me.alive != false) { me.move(); }
    });

    every((10).seconds(), function() {
      if (me.alive != false) { 
        me.birthday(); 
      }
    });
  };

  return ConwayRobot;

})();

var PebbleRobot = (function() {
  function PebbleRobot() {}

  PebbleRobot.prototype.connection = { name: 'pebble', adaptor: 'pebble' };
  PebbleRobot.prototype.device = { name: 'pebble', driver: 'pebble' };
  PebbleRobot.prototype.work = function(me) {
      var dead = 0;
      var alive = 0;
      me.pebble.on('connect', function() { console.log("Pebble Connected!"); });
      every((1).second(), function(){
        alive = 0;
        dead = 0;
        for (var i = 0; i < bots.length; i++) {
          var bot = bots[i];
          me.master.findRobot(bot.name, function(error, spheroBot) {
            if spheroBot.alive == true {
              alive += 1; 
            } else {
              dead += 1;
            }
          });    
        }
        var msg = "alive: " + alive + "\ndead: " + dead + "\n" 
        me.message_queue().push(msg);
      });
  };

  return PebbleRobot;
})();

for (var i = 0; i < bots.length; i++) {
  var bot = bots[i];
  var robot = new ConwayRobot;

  robot.connection.port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);
}

var robot = new PebbleRobot;
robot.name = "pebble";
Cylon.robot(robot);

Cylon.api({host: '10.22.25.22', port: '8080', ssl:  false});
Cylon.start();