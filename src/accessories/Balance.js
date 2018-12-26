const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Balance extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Balance';
    this.name = obj.name || 'Баланс, ₽';
    this.type = 'LightSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.balance.active.value;
  }
}
