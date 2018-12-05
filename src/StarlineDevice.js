let _get = require('lodash/get');
let StarlineRemote    = require('./StarlineRemote');
let StarlineAccessory = require('./StarlineAccessory');

module.exports = class StarlineDevice {
  /**
   * Constructor
   *
   * @param  {Function} log
   * @param  {Object}   hap
   * @param  {Object}   config
   */
  constructor(log, hap, config) {
    this.hap         = hap;
    this.config      = config;
    this.accessories = [];

    log.prefix = config['alias'];

    this.log   = function(message) { log.log(null, message) }
    this.debug = function(message) { log.debug('[DEBUG]', message) }

    // Check if we have device info
    if (!config.username) throw new Error(`Starline username is required for ${config['alias']}`);
    if (!config.password) throw new Error(`Starline password is required for ${config['alias']}`);

    // Create the remote for the device
    this.remote = new StarlineRemote(this);

    // Create accessories for device
    this.initAccessories();
  }

  /**
   * Create the accessories for this device
   *
   * @return {Array}
   */
  initAccessories() {
    this.accessories = [];

    // If we have custom switches create them
    if (Array.isArray(this.config['accessories'])) {
      for (let element of this.config['accessories']) {
        // Create and add the new accessory
        this.accessories.push(new StarlineAccessory({...this, config: {...this.config, ...element}}, element.type, element.key));
      }
    }
  }

  updateAccessoryInfo(data) {
    for (let accessory of this.accessories) {
      const state = _get(data, accessory.key);
      if (typeof state !== 'undefined') {
        accessory.update(state);
      }
    }
  }
}
