const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Trunk extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Trunk';
    this.name = obj.name || 'Багажник';
    this.type = 'ContactSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.trunk;
  }
}
