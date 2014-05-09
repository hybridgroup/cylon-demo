var Cylon = require('cylon');
var haarcascade = "" + __dirname + "/haarcascade_frontalface_alt.xml";

Cylon.robot({
  connections: [
    { name: 'opencv', adaptor: 'opencv' }, 
    { name: 'ardrone', adaptor: 'ardrone', port: '192.168.1.1' }
  ],
  devices: [
    { name: 'drone', driver: 'ardrone', connection: 'ardrone' }, 
    { name: 'window', driver: 'window', conneciton: 'opencv' }, 
    { name: 'mat', driver: 'mat', conneciton: 'opencv' }
  ],
  work: function(my) {
    this.detect = false;
    this.image = null;
    my.drone.getPngStream().on('data', (function(_this) {
      return function(png) {
        return my.mat.readImage(png, function(err, img) {
          _this.image = img;
          if (_this.detect === false) {
            return my.window.show(img);
          }
        });
      };
    })(this));
    my.mat.on('facesDetected', (function(_this) {
      return function(err, im, faces) {
        var biggest, center_x, f, face, turn, _i, _len;
        biggest = 0;
        face = null;
        for (_i = 0, _len = faces.length; _i < _len; _i++) {
          f = faces[_i];
          if (f.width > biggest) {
            biggest = f.width;
            face = f;
          }
        }
        if (face !== null && (face.width <= 100 && face.width >= 45)) {
          im.rectangle([face.x, face.y], [face.x + face.width, face.y + face.height], [0, 255, 0], 2);
          center_x = im.width() * 0.5;
          turn = -(face.x - center_x) / center_x;
          console.log("turning: " + turn);
          if (turn < 0) {
            my.drone.clockwise(Math.abs(turn * 0.7));
          } else {
            my.drone.counterClockwise(Math.abs(turn * 0.7));
          }
        }
        return my.window.show(im);
      };
    })(this));
    my.drone.takeoff();
    after(8..seconds(), function() {
      return my.drone.up(0.5);
    });
    after(10..seconds(), function() {
      return my.drone.hover();
    });
    return after(13..seconds(), (function(_this) {
      return function() {
        _this.detect = true;
        every(0.3.seconds(), function() {
          my.drone.hover();
          return my.mat.detectFaces(_this.image, haarcascade);
        });
        return after(30..seconds(), function() {
          return my.drone.land();
        });
      };
    })(this));
  }
});

Cylon.start();