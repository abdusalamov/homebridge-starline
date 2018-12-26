const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Arm extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Arm';
    this.name = obj.name || 'Охрана';
    this.type = 'Switch';
    this.key = 'arm';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.arm;
  }
}
