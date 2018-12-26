const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Handsfree extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Handsfree';
    this.name = obj.name || 'Свободные руки';
    this.type = 'Switch';
    this.key = 'hfree';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.hfree;
  }
}
