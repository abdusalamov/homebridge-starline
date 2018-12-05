let exec      = require('child_process').exec;
let request   = require('co-request');

module.exports = class StarlineRemote {
  /**
   * Constructor
   *
   * @param  {Object} device
   */
  constructor(device) {
    this.name       = device.config.name  || 'StarlineVehicle';
    this.username   = device.config.username || '';
    this.password   = device.config.password   || '';
    this.interval   = device.config.interval || 10000;
    this.tz         = device.config.tz || 180;
    this.updateAccessoryInfo = device.updateAccessoryInfo.bind(device);

    this.device     = device;
    this.currentState = device;

    this.turningOn  = null;
    this.turningOff = null;
    this.checkingState = null;

    this.remote = new RemoteService(this);

    this.checkState();
  }

  async checkState() {
    if (this.checkingState) {
      return Promise.reject('Checking state is in progress');
    }
    // console.log('Checking state');
    this.checkingState = true;

    const state = await this.remote.getState();
    if (state) {
      this.currentState = state;
      this.updateAccessoryInfo(state);
    } else {
      console.log('checking is fault');
    }
    this.checkingState = false;
    await this._delay(this.interval);
    this.checkState();
  }

  async executeCommand(...args) {
    return await this.remote.executeCommand(this.currentState.device_id, ...args);
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


class RemoteService {
  constructor(config) {
    this.username = config.username;
    this.password = config.password;
    this.name = config.name;
    this.prefix = `https://starline-online.ru`;
    this.cookies = null;
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:28.0) Gecko/20100101 Firefox/2.0',
      // 'Accept': 'application/json, text/javascript, */*; q=0.01',
      // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  
  async request(obj) {
    if (!this.cookies) {
      await this.authentication();
    }

    let result = await request(obj);

    if (result.statusCode === 403) {
      await this.authentication();
      result = await request({
        ...obj,
        headers: {
          ...obj.headers,
          Cookie: this.cookies
        }
      });
    }
    return result;
  }

  async authentication() {
    try {
      const result = await request({
        uri: `${this.prefix}/user/login`,
        method: 'POST',
        form: {
          'LoginForm[login]': this.username,
          'LoginForm[pass]': this.password
        },
        headers: this.headers
      });
      if (result.statusCode === 200) {
        this.cookies = this.parseCookies(result.headers['set-cookie']);
        return true;
      }
      return false;
    } catch (e) {
      console.error('e');
    }
  }

  parseCookies(rawData) {
    const result = [];
    rawData.forEach(raw => {
      if (!raw.includes('PHPSESSID')) return;
      result.push(raw.split(';')[0]);
    });
    return result.join(';');
  }
  
  async getState() {
    try {
      const result = await this.request({
        uri: `${this.prefix}/device?tz=${this.tz}`,
        method: 'GET',
        headers: {
          ...this.headers,
          Cookie: this.cookies
        },
        json: true
      });
      if (result.statusCode === 200) {
        const devices = result.body.answer.devices;
        const device = devices.find((element) => {
          if (element.alias === this.name) {
            return true;
          }
        });
        if (!device) {
          throw new Error('Device by specified name is not found');
        }
        return device;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async executeCommand(deviceId, key, value) {
    try {
      const result = await this.request({
        uri: `${this.prefix}/device/${deviceId}/executeCommand`,
        method: 'POST',
        form: {
          'value': value ? 1 : 0,
          'action': key,
          'password': ''
        },
        headers: {
          ...this.headers,
          Cookie: this.cookies
        }
      });
      return result.statusCode === 204;
    } catch (e) {
      throw new Error(e);
    }
  }
}
