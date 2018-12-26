const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Alarm extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Alarm';
    this.name = obj.name || 'Сигнализация';
    this.type = 'MotionSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.alarm;
  }
}
