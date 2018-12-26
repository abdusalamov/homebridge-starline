const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class GPS extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'GPS';
    this.name = obj.name || 'GPS';
    this.type = 'HumiditySensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.gps_lvl;
  }

  update(state) {
    let percents = Math.min(state / 16 * 100, 100);
    this.service
      .getCharacteristic(this.hap.Characteristic.CurrentRelativeHumidity)
      .updateValue(percents);
  }
}
