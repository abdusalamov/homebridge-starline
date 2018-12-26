const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Handbrake extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Handbrake';
    this.name = obj.name || 'Ручной тормоз';
    this.type = 'MotionSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.hbrake;
  }
}
