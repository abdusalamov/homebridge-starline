const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Tilt extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Tilt';
    this.name = obj.name || 'Наклон';
    this.type = 'MotionSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.tilt_bpass;
  }
}
