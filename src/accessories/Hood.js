const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Hood extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Hood';
    this.name = obj.name || 'Капот';
    this.type = 'ContactSensor';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.hood;
  }
}
