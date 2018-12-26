module.exports = class StarlineAccessory {
  /**
   * Constructor
   *
   * @param  {Object}   device
   * @param  {String}   type
   */
  constructor(device) {
    this.log     = device.log;
    this.hap     = device.hap;
    this.device  = device;
    this.remote  = device.remote;
    this.accessory = device.accessory;

    this.name    = device.config['name'];

    this.initAccessory();
  }

  initAccessory() {
    this.service = this.accessory.initializeService(this.remote);
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

  update(state) {
    this.accessory.update(state);
  }
}
