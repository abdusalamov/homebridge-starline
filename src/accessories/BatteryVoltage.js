const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class BatteryVoltage extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'BatteryVoltage';
    this.name = obj.name || 'Напряжение сети';
    this.type = 'LightSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.battery;
  }
}
