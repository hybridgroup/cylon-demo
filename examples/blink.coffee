Cylon = require 'cylon'

# Initialize the robot
Cylon.robot
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0' }
  #connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyUSB0' }

  device: { name: 'led', driver: 'led', pin: 13 }
  #device: { name: 'led', driver: 'led', pin: 3 }

  work: (my) ->
    every 1.second(), -> my.led.toggle()

.start()
