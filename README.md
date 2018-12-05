# homebridge-starline
This is a plugin for [homebridge](https://github.com/nfarina/homebridge). It allows you to control your Starline with HomeKit and Siri.

![HomeKit-Screenshot](https://raw.githubusercontent.com/abdusalamov/homebridge-starline/master/screenshotes/img1.jpg)

## Installation
- Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md)
- Install this plugin using: `npm install -g --unsafe-perm homebridge-starline`
- Update your configuration file. See below for a sample.
- Run the HomeBridge server


## Configuration
- Edit your configuration file from `~/.homebridge/config.json`
- Platform should always be **StarlinePlatform** then on the devices you can add your Starline's
- The **Username** and **Password** are required in order to send the commands

```
"platforms": [{
    "platform": "StarlinePlatform",
    "devices": [{
        "name": "BMW 528i",
        "username": "superman",
        "password": ""
    }]
}]
```

### By default no one switch will be created for the Starline. You do have the option to create more custom switches with different actions. Accessories with type `Switch` can send commands to you vehicle! You can add some custom accessories if you are learn API of Starline-online.

```
"platforms": [{
    "platform": "StarlinePlatform",
    "devices": [{
        "name": "BMW 528i",
        "username": "superman",
        "password": "",
        "interval": 5000,
        "tz": 180,
        "accessories": [
          { "name": "Car online", "type": "Lightbulb", "key": "status" },
          { "name": "Engine", "type": "Switch", "key": "car_state.ign" },
          { "name": "Alarm", "type": "MotionSensor", "key": "car_state.alarm" },
          { "name": "Engine temperature", "type": "TemperatureSensor", "key": "etemp" },
          { "name": "Cabin temperature", "type": "TemperatureSensor", "key": "ctemp" },
          { "name": "Voltage", "type": "LightSensor", "key": "battery" },
          { "name": "GPS", "type": "Lightbulb", "key": "gps_lvl" },
          { "name": "GSM", "type": "Lightbulb", "key": "gsm_lvl" },
          { "name": "Balance, ₽", "type": "LightSensor", "key": "balance.active.value" },
          { "name": "Security", "type": "Switch", "key": "car_state.arm" },
          { "name": "Doors", "type": "ContactSensor", "key": "car_state.door" },
          { "name": "Hand brake", "type": "MotionSensor", "key": "car_state.hbrake" },
          { "name": "Hood", "type": "MotionSensor", "key": "car_state.hood" },
          { "name": "Ignition", "type": "MotionSensor", "key": "car_state.run" },
          { "name": "Trunk", "type": "MotionSensor", "key": "car_state.trunk" },
          { "name": "Webasto", "type": "MotionSensor", "key": "car_state.webasto" },
          { "name": "Tilt", "type": "MotionSensor", "key": "car_state.tilt_bpass" },
          { "name": "Shock", "type": "MotionSensor", "key": "car_state.shock_bpass" }
      ]
    }]
}]
```

## Device settings
All settings (except delay) are required

| Name | Description |
| :------------ | :------------ |
| name | Name of the device in Starline system |
| username | The username of your Starline account |
| password | :) |
| interval | This is the interval between check states of vehicle. By default it is `10000 ms` |
| tz | TimeZone in minutes. By default it is `180` (Europe/Moscow) |

## Common Issues

### HomeBridge is crashing because of the plugin
The server is crashing at load with the folowing error `SyntaxError: Unexpected token ...`
Update your **Node** to a newer version.

### Other
If you have other problem run HomeBridge with debug mode `DEBUG=* homebridge -D` and [open a new Issue](https://github.com/abdusalamov/homebridge-starline/issues/new) and we will try to figure it out together :)

