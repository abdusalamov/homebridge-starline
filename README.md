# homebridge-starline
This is a plugin for [homebridge](https://github.com/nfarina/homebridge). It allows you to control your Starline with HomeKit and Siri.

![HomeKit-Screenshot](https://raw.githubusercontent.com/abdusalamov/homebridge-starline/master/screenshotes/img1.png)

## Installation
- Install HomeBridge, please follow it's [README](https://github.com/nfarina/homebridge/blob/master/README.md)
- Install this plugin using: `npm install -g --unsafe-perm homebridge-starline`
- Update your configuration file. See below for a sample.
- Run the HomeBridge server


## Configuration
- Edit your configuration file from `~/.homebridge/config.json`
- Platform should always be **StarlinePlatform** so on the devices you can add your Starline's
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

### By default all available accessories will be created for the Starline. You do have the option to change or remove some accessories. Use the `patchAccessories` for that. Specify the accessory code, and now you can hide accessory (disabled: true) or change name. Below you can find a list of all accessories.

```
"platforms": [{
    "platform": "StarlinePlatform",
    "devices": [{
        "name": "BMW 528i",
        "username": "superman",
        "password": "",
        "interval": 5000,
        "tz": 180,
        "patchAccessories": [
          {
            "code": "Webasta",
            "disabled": false,
            "name": "Предпусковой подогрев"
          }
        ]
    }]
}]
```

## Device settings

| Name | Description |
| :------------ | :------------ |
| name * | Name of the device in Starline system |
| username * | The username of your Starline account |
| password * | :) |
| interval | This is the interval between check states of vehicle. By default it is `5000 ms` (every 5 seconds) |
| tz | TimeZone in minutes. By default it is `180` (Europe/Moscow) |

## Common Issues

### HomeBridge is crashing because of the plugin
The server is crashing at load with the folowing error `SyntaxError: Unexpected token ...`
Update your **Node** to a newer version.

### Other
If you have some other problem run HomeBridge with debug mode `DEBUG=* homebridge -D` and [open a new Issue](https://github.com/abdusalamov/homebridge-starline/issues/new) and we will try to figure it out together :)

## Accessories list
```
CarOnline
Engine
AddSens
Alarm
Arm
Balance
BatteryVoltage
CabinTemperature
Doors
EngineTemperature
GPS
GSM
Handbrake
Handsfree
Hijack
Hood
Poke
Run
Shock
Tilt
Trunk
Valet
Webasto
```

