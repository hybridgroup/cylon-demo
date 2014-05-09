var Cylon = require('cylon');

Cylon.robot({
  connections: [
    {name: 'dualshock3', adaptor: 'joystick', controller: 'dualshock3'}, 
    {name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1'},
    {name: 'opencv', adaptor: 'opencv'}
  ],
  devices: [
    {name: 'controller', driver: 'dualshock3', connection: 'dualshock3'}, 
    {name: 'drone', driver: 'ardrone', connection: 'ardrone'},
    {name: 'window', driver: 'window', conneciton: 'opencv'},
    {name: 'opencv', driver: 'opencv', conneciton: 'opencv'}
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
    my.drone.getPngStream().on('data', function(png) {
      my.opencv.readImage(png, function(err, img) {
        my.window.show(img);
      });
    });
    
    this.offset = 125.0;
    this.right_stick = {
      x: this.offset,
      y: this.offset
    };
    this.left_stick = {
      x: this.offset,
      y: this.offset
    };
    my.controller.on("square:press", function() {
      return my.drone.takeoff();
    });
    my.controller.on("triangle:press", function() {
      return my.drone.hover();
    });
    my.controller.on("x:press", function() {
      return my.drone.land();
    });
    my.controller.on("right:move", (function(_this) {
      return function(pair) {
        return _this.right_stick = pair;
      };
    })(this));
    my.controller.on("left:move", (function(_this) {
      return function(pair) {
        return _this.left_stick = pair;
      };
    })(this));
    every(0, (function(_this) {
      return function() {
        var pair;
        pair = _this.left_stick;
        if (pair.y < _this.offset - 5) {
          my.drone.front(my.validate_pitch(pair.y - _this.offset, _this.offset));
        } else if (pair.y > _this.offset + 5) {
          my.drone.back(my.validate_pitch(pair.y - _this.offset, _this.offset));
        }
        if (pair.x > _this.offset + 5) {
          return my.drone.right(my.validate_pitch(pair.x - _this.offset, _this.offset));
        } else if (pair.x < _this.offset - 5) {
          return my.drone.left(my.validate_pitch(pair.x - _this.offset, _this.offset));
        }
      };
    })(this));
    every(0, (function(_this) {
      return function() {
        var pair;
        pair = _this.right_stick;
        if (pair.y < _this.offset - 5) {
          my.drone.up(my.validate_pitch(pair.y - _this.offset, _this.offset));
        } else if (pair.y > _this.offset + 5) {
          my.drone.down(my.validate_pitch(pair.y - _this.offset, _this.offset));
        }
        if (pair.x > _this.offset + 20) {
          return my.drone.clockwise(my.validate_pitch(pair.x - _this.offset, _this.offset));
        } else if (pair.x < _this.offset - 20) {
          return my.drone.counterClockwise(my.validate_pitch(pair.x - _this.offset, _this.offset));
        }
      };
    })(this));
    return every(0.1.seconds(), (function(_this) {
      return function() {
        return my.drone.hover();
      };
    })(this));
  }
});

Cylon.start();
