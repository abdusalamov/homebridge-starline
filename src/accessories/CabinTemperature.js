const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class CabinTemperature extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'CabinTemperature';
    this.name = obj.name || 'Температура салона';
    this.type = 'TemperatureSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.ctemp;
  }
}
