const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Doors extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Doors';
    this.name = obj.name || 'Двери';
    this.type = 'ContactSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.door;
  }
}
