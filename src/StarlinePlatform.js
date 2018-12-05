let Hap;

let StarlineDevice = require('./StarlineDevice');

module.exports = function(homebridge) {
  Hap = homebridge.hap;
  
  homebridge.registerPlatform("homebridge-starline", "StarlinePlatform", StarlinePlatform);
}

class StarlinePlatform {
  /**
   * Constructor
   *
   * @param  {Function} log
   * @param  {Object}   config
   */
  constructor(log, config) {
    this.log     = log;
    this.devices = config['devices'] || {};
  }

  /**
   * Get accessories for this platform
   *
   * @param  {Function} callback
   */
  accessories(callback) {
    let accessoryList = [];

    // Process each device
    for (let device of this.devices) {
      // Create the new device
      device = new StarlineDevice(this.log, Hap, device);

      // Add the new device accessories to the list
      accessoryList = [...accessoryList, ...device.accessories];
    }

    // Return the accessories
    callback(accessoryList);
  }
}
