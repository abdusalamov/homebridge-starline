const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Shock extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Shock';
    this.name = obj.name || 'Удар';
    this.type = 'MotionSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.shock_bpass;
  }
}
