const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Hijack extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Hijack';
    this.name = obj.name || 'Антиограбление';
    this.type = 'Switch';
    this.key = 'hijack';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.hijack;
  }
}
