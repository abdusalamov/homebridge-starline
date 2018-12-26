const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Run extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Run';
    this.name = obj.name || 'Зажигание';
    this.type = 'MotionSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.run;
  }
}
