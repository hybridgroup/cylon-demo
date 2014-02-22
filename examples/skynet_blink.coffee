Cylon = require 'cylon'

Cylon.robot
  connections: [
    { name: 'beaglebone', adaptor: 'beaglebone'},
    { name: 'skynet', adaptor: 'skynet', uuid: "67f040c1-9bf8-11e3-af21-030ff142869f", token: "8bf0jls222tvs4iw6e94wa09qm8ia4i" }
  ]

  device: { name: 'led', driver: 'led', pin: 'P9_12', connection: 'beaglebone' }

  work: (my) ->
    Logger.info "connected..."

    my.connections['skynet'].on 'message', (channel, data) ->
      console.log(data)
      if data.red is 'on'
        console.log("red on request received from skynet");
        my.led.turnOn()
      else if data.red is 'off'
        console.log("red off request received from skynet");
        my.led.turnOff()

.start()
