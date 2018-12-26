const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Engine extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Engine';
    this.name = obj.name || 'Двигатель';
    this.type = 'Switch';
    this.key = 'ign';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.ign;
  }
}
