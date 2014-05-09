var Cylon = require('cylon');

Cylon.robot({
  connections: [
    {name: 'opencv', adaptor: 'opencv'},
    {name: 'dualshock3', adaptor: 'joystick', controller: 'dualshock3'}, 
    {name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1'}
  ],
  devices: [
    {name: 'mat', driver: 'mat', conneciton: 'opencv' },
    {name: 'window', driver: 'window', conneciton: 'opencv'},
    {name: 'controller', driver: 'dualshock3', connection: 'dualshock3'}, 
    {name: 'drone', driver: 'ardrone', connection: 'ardrone'}
  ],
  validate_pitch: function(data, offset) {
    var value;
    value = Math.abs(data) / offset;
    if (value >= 0.1) {
      if (value <= 1.0) {
        return Math.round(value * 100.0) / 100.0;
      } else {
        return 1.0;
      }
    } else {
      return 0.0;
    }
  },
  work: function(my) {
    var self = this; 
    self.offset = 125.0;
    self.right_stick = {
      x: self.offset,
      y: self.offset
    };
    self.left_stick = {
      x: self.offset,
      y: self.offset
    };

    my.drone.getPngStream().on('data', function(png) {
      my.mat.readImage(png, function(err, img) {
        my.window.show(img);
      });
    });
    my.controller.on("square:press", function(data) {
      my.drone.takeoff();
    });
    my.controller.on("triangle:press", function(data) { 
      my.drone.hover()
    });
    my.controller.on("x:press", function(data) {
      my.drone.land()
    });
    my.controller.on("right:move", function(data) {
      self.right_stick = data;
    });
    my.controller.on("left:move", function(data) {
      self.left_stick = data;
    });
    every(0, function() {
      var pair;
      pair = self.left_stick;
      if (pair.y < self.offset - 5) {
        my.drone.front(my.validate_pitch(pair.y - self.offset, self.offset));
      } else if (pair.y > self.offset + 5) {
        my.drone.back(my.validate_pitch(pair.y - self.offset, self.offset));
      }
      if (pair.x > self.offset + 5) {
        my.drone.right(my.validate_pitch(pair.x - self.offset, self.offset));
      } else if (pair.x < self.offset - 5) {
        my.drone.left(my.validate_pitch(pair.x - self.offset, self.offset));
      }
    });
    every(0, function() {
      var pair;
      pair = self.right_stick;
      if (pair.y < self.offset - 5) {
        my.drone.up(my.validate_pitch(pair.y - self.offset, self.offset));
      } else if (pair.y > self.offset + 5) {
        my.drone.down(my.validate_pitch(pair.y - self.offset, self.offset));
      }
      if (pair.x > self.offset + 20) {
        my.drone.clockwise(my.validate_pitch(pair.x - self.offset, self.offset));
      } else if (pair.x < self.offset - 20) {
        my.drone.counterClockwise(my.validate_pitch(pair.x - self.offset, self.offset));
      }
    });
    every((0.1).seconds(), my.drone.hover);
  }
});

Cylon.start();