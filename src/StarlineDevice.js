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
    this.accessoryTypes = [
      'CarOnline',
      'Engine',
      'AddSens',
      'Alarm',
      'Arm',
      'Balance',
      'BatteryVoltage',
      'CabinTemperature',
      'Doors',
      'EngineTemperature',
      'GPS',
      'GSM',
      'Handbrake',
      'Handsfree',
      'Hijack',
      'Hood',
      'Poke',
      'Run',
      'Shock',
      'Tilt',
      'Trunk',
      'Valet',
      'Webasto'
    ];

    log.prefix = config['alias'];

    this.log   = function(message) { log.log(null, `[StarlinePlatform] ${message}`) }
    this.debug = function(message) { log.debug('[StarlinePlatform] [DEBUG]', message) }

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
    
    for (let type of this.accessoryTypes) {
      const patch = this.findPatch(type);
      if (patch && patch.disabled) {
        continue;
      }
      const accessory = new (require(`./accessories/${type}`))(this.hap, {
        name: patch && patch.name
      });
      // Create and add the new accessory
      this.accessories.push(new StarlineAccessory({ ...this, accessory, config: { ...this.config, ...accessory } }));
    }
  }

  findPatch(type) {
    if (!Array.isArray(this.config['patchAccessories'])) {
      return;
    }
    for (let patch of this.config['patchAccessories']) {
      if (patch.code === type) {
        return patch;
      }
    }
  }

  updateAccessoryInfo(data) {
    for (let starlineAccessory of this.accessories) {
      const accessory = starlineAccessory.accessory;
      const state = accessory.getAccessoryState(data);
      if (typeof state !== 'undefined') {
        accessory.update(state);
      }
    }
  }
}
