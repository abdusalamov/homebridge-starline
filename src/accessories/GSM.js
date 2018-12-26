const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class GSM extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'GSM';
    this.name = obj.name || 'GSM';
    this.type = 'HumiditySensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.gsm_lvl;
  }

  update(state) {
    let percents = Math.min(state / 30 * 100, 100);
    this.service
      .getCharacteristic(this.hap.Characteristic.CurrentRelativeHumidity)
      .updateValue(percents);
  }
}
