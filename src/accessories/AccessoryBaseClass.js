const services = {
  Switch: require('./../services/Switch'),
  Lightbulb: require('./../services/Lightbulb'),
  ContactSensor: require('./../services/ContactSensor'),
  HumiditySensor: require('./../services/HumiditySensor'),
  LightSensor: require('./../services/LightSensor'),
  MotionSensor: require('./../services/MotionSensor'),
  TemperatureSensor: require('./../services/TemperatureSensor'),
}

module.exports = class AccessoryBaseClass {
  constructor(hap) {
    this.hap = hap;
  }

  init() {
    if (!this.code || !this.name || !this.type) {
      throw new Error('Need more required fields: code, name, type');
    }
    if (this.type === 'Switch' && !this.key) {
      throw new Error('The accessory with type Switch requires field key');
    }
  }

  getAccessoryState() {
    throw new Error('The method getAccessoryState() must be overridden.');
  }

  initializeService(remote) {
    this.service = services[this.type].init(this.hap, this.name, this.key, remote);
    this.remote = remote;
    return this.service;
  }

  update(state) {
    services[this.type].update(state, this.service, {
      hap: this.hap,
      name: this.name,
      key: this.key
    });
  }
}
