Cylon = require 'cylon'
 
Cylon.robot
  connections: [
    { name: 'leapmotion', adaptor: 'leapmotion', port: '127.0.0.1:6437' },
    { name: 'skynet', adaptor: 'skynet', uuid: "0675b9d1-9b7e-11e3-af21-030ff142869f", token: "yr2oi19yyspmbo6rcgkp7gov5i2j4i" },
  ]
 
  device:
    { name: 'leapmotion', driver: 'leapmotion', connection: 'leapmotion' }
 
  led: (status) ->
    console.log status
    this.skynet.message
      "devices": ["67f040c1-9bf8-11e3-af21-030ff142869f"],
      "message":
        'red': status

  work: (my) ->
    @hand = false
    my.leapmotion.on 'frame', (frame) =>
      if frame.hands.length > 0
        @hand = true
      else
        @hand = false 

    every 1.seconds(), =>
      if @hand == true
        my.led 'on'
      else
        my.led 'off'
      
 
.start()
