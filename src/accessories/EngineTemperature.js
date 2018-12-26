const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class EngineTemperature extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'EngineTemperature';
    this.name = obj.name || 'Температура двигателя';
    this.type = 'TemperatureSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.etemp;
  }
}
