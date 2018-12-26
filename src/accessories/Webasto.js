const AccessoryBaseClass = require('./AccessoryBaseClass');

module.exports = class Webasto extends AccessoryBaseClass {
  constructor(hap, obj) {
    super(hap, obj);
    this.code = 'Webasto';
    this.name = obj.name || 'Webasto';
    this.type = 'Switch';
    this.key = 'webasto';

    this.init();
  }

  getAccessoryState(data) {
    return data.car_state.webasto;
  }
}
