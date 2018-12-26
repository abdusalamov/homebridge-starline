const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class AddSens extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'AddSens';
    this.name = obj.name || 'Доп. канал';
    this.type = 'Switch';
    this.key = 'add_sens_bpass';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.add_sens_bpass;
  }
}
