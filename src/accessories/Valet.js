const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Valet extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Valet';
    this.name = obj.name || 'Сервисный режим';
    this.type = 'Switch';
    this.key = 'valet';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.valet;
  }
}
