const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Poke extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Poke';
    this.name = obj.name || 'Гудок';
    this.type = 'Switch';
    this.key = 'poke';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.poke;
  }
}
