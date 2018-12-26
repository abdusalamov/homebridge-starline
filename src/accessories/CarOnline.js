const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class CarOnline extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'CarOnline';
    this.name = obj.name || 'Car Online';
    this.type = 'Lightbulb';

    this.init();
  }

  getAccessoryState(data) {
    return data.status;
  }
}
