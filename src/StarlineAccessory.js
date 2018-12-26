module.exports = class StarlineAccessory {
  /**
   * Constructor
   *
   * @param  {Object}   device
   * @param  {String}   type
   */
  constructor(device, type, key) {
    this.log     = device.log;
    this.hap     = device.hap;
    this.device  = device;
    this.remote  = device.remote;

    this.type    = type || 'power';
    this.name    = device.config['name'];
    this.key     = key;

    this.initAccessory();
  }

  initAccessory() {
    if (this.type === 'Switch') {
      this.service = new this.hap.Service.Switch(this.name);
      this.service.getCharacteristic(this.hap.Characteristic.On)
        .on('set', this._setSwitch.bind(this, this.key));
    } else if (this.type === 'TemperatureSensor') {
      this.service = new this.hap.Service.TemperatureSensor(this.name);
      this.service
        .getCharacteristic(this.hap.Characteristic.CurrentTemperature)
        .setProps({
          minValue: -50
        });
    } else if (this.type === 'MotionSensor') {
      this.service = new this.hap.Service.MotionSensor(this.name);
    } else if (this.type === 'ContactSensor') {
      this.service = new this.hap.Service.ContactSensor(this.name);
    } else if (this.type === 'Lightbulb') {
      this.service = new this.hap.Service.Lightbulb(this.name);
      this.service
        .getCharacteristic(this.hap.Characteristic.On)
    } else if (this.type === 'HumiditySensor') {
      this.service = new this.hap.Service.HumiditySensor(this.name);
    } else if (this.type === 'LightSensor') {
      this.service = new this.hap.Service.LightSensor(this.name);
    }
  }

  /**
   * Get accessory information
   *
   * @return {Service}
   */
  getInformationService() {
    return new this.hap.Service.AccessoryInformation()
      .setCharacteristic(this.hap.Characteristic.Name, this.remote.name)
      .setCharacteristic(this.hap.Characteristic.Manufacturer, 'Starline')
      .setCharacteristic(this.hap.Characteristic.Model, 'Starline')
      .setCharacteristic(this.hap.Characteristic.SerialNumber, this.remote.username);
  }

  /**
   * Get accessory service
   *
   * @return {Array}
   */
  getServices() {
    return [this.service, this.getInformationService()];
  }

  /**
   * Private: Set child switch status
   *
   * @param {Boolean}  value
   * @param {Function} callback
   */
  async _setSwitch(key, value, callback) {
    this.log(`${key} - ${value}`);
    try {
      const result = await this.remote.executeCommand(key.split('.')[1], value);
      let newState = value;
      if (result) {
        newState = !value
      }
      this.service.getCharacteristic(this.hap.Characteristic.On).updateValue(newState);

      return callback(null, newState);
    } catch (e) {
      this.service.getCharacteristic(this.hap.Characteristic.On).updateValue(!value);

      return callback(true);
    }
  }

  update(state) {
    if (this.type === 'Switch') {
      this.service
        .getCharacteristic(this.hap.Characteristic.On)
        .updateValue(state);
    } else if (this.type === 'MotionSensor') {
      this.service
        .getCharacteristic(this.hap.Characteristic.MotionDetected)
        .updateValue(state);
    } else if (this.type === 'ContactSensor') {
      this.service
        .getCharacteristic(this.hap.Characteristic.ContactSensorState)
        .updateValue(!state ? this.hap.Characteristic.ContactSensorState.CONTACT_DETECTED : this.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
    } else if (this.type === 'TemperatureSensor') {
      this.service
        .getCharacteristic(this.hap.Characteristic.CurrentTemperature)
        .updateValue(state);
    } else if (this.type === 'HumiditySensor') {
      let percents = 0;
      if (this.key === 'gsm_lvl') {
        percents = state / 30 * 100;
      } else if (this.key === 'gps_lvl') {
        percents = Math.min(state / 16 * 100, 100);
      }
      if (this.key !== 'status') {
        this.service
          .getCharacteristic(this.hap.Characteristic.CurrentRelativeHumidity)
          .updateValue(percents);
      }
    } else if (this.type === 'Lightbulb') {
      this.service
        .getCharacteristic(this.hap.Characteristic.On)
        .updateValue(!!state);
    } else if (this.type === 'LightSensor') {
      this.service
        .getCharacteristic(this.hap.Characteristic.CurrentAmbientLightLevel)
        .updateValue(state);
    }
  }

  /**
   * Private: Create a delay
   *
   * @param  {Number} ms
   * @return {Promise}
   */
  _delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}
