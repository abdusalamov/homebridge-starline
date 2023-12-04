let request   = require('co-request');
let md5 = require('md5');
let sha1 = require('sha1');

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
    this.appId      = device.config.appId   || '';
    this.secret     = device.config.secret   || '';
    this.interval   = device.config.interval || 180000;
    this.debug      = device.debug;
    this.log        = device.log;
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

    this.checkingState = true;

    const state = await this.remote.getState();
    if (state) {
      this.currentState = state;
      this.updateAccessoryInfo(state);
    } else {
      this.log('Checking failed');
    }
    this.checkingState = false;
    await this._delay(this.interval);
    this.checkState();
  }

  async executeCommand(...args) {
    return /* await */ this.remote.executeCommand(this.currentState.device_id, ...args);
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
    this.appId = config.appId;
    this.secret = config.secret;
    this.name = config.name;
    this.log = config.log;
    this.debug = config.debug;
    this.cookies = null;
    this.appCode = null;
    this.appToken = null;
    this.slidToken = null;
    this.userId = null;

    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  
  async request(obj) {
    if (!this.cookies) {
      await this.authentication();
    }

    let result = await request({
      ...obj,
      headers: {
        ...obj.headers,
        Cookie: this.cookies
      }
    });

    if (result.statusCode === 403) {
      await this.authentication();
      return await request({
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
      if (!this.appCode) {
        const uri = `https://id.starline.ru/apiV3/application/getCode?appId=${this.appId}&secret=${md5(this.secret)}`;
        const result = await request({
          uri: uri,
          method: 'GET',
          headers: this.headers
        });
        let response = JSON.parse(result.body);
        if (result.statusCode === 200 && response.state === 1) {
          this.appCode = response.desc.code;
          this.debug('Get appCode: ' + this.appCode);
        }
        else if (result.statusCode === 200) {
          this.log(`Couldn't get appCode: (${response.desc.message}).`);
          return false;
        }
        else {
          this.log(`Request to ${uri} failed.`);
          return false;
        }
      }

      if (this.appCode && !this.appToken) {
        const uri = `https://id.starline.ru/apiV3/application/getToken?appId=${this.appId}&secret=${md5(this.secret + this.appCode)}`;
        const result = await request({
          uri: uri,
          method: 'GET',
          headers: this.headers
        });
        let response = JSON.parse(result.body);
        if (result.statusCode === 200 && response.state === 1) {
          this.appToken = response.desc.token;
          this.debug('Get appToken: ' + this.appToken);
        }
        else if (result.statusCode === 200) {
          this.log(`Couldn't get appToken: (${response.desc.message}).`);
          return false;
        }
        else {
          this.log(`Request to ${uri} failed.`);
          return false;
        }
      }

      if (this.appCode && this.appToken && !this.slidToken) {
        const uri = 'https://id.starline.ru/apiV3/user/login';
        const body = {
          'login': this.username,
          'pass': sha1(this.password),
        };
        const result = await request({
          uri: uri,
          method: 'POST',
          form: body,
          headers: {
            ...this.headers,
            token: this.appToken
          }
        });
        let response = JSON.parse(result.body);
        if (result.statusCode === 200 && response.state === 1) {
          this.slidToken = response.desc.user_token;
          this.debug('Get slidToken: ' + this.slidToken);
        }
        else if (result.statusCode === 200) {
          this.log(`Couldn't get slidToken: (${response.desc.message}).`);
          return false;
        }
        else {
          this.log(`Request to ${uri} with ${JSON.stringify(body)} failed.`);
          return false;
        }
      }

      if (this.appCode && this.appToken && this.slidToken && !this.userId) {
        const uri = 'https://developer.starline.ru/json/v2/auth.slid';
        const result = await request({
          uri: uri,
          method: 'POST',
          body: JSON.stringify({slid_token: this.slidToken}),
          headers: {
            ...this.headers,
            'Content-Type': 'application/json; charset=UTF-8'
          }
        });
        let response = JSON.parse(result.body);
        if (result.statusCode === 200 && (response.code === 200 || response.codestring === 'OK')) {
          this.userId = response.user_id;
          this.cookies = this.parseCookies(result.headers['set-cookie']);
          this.debug('Get cookies: ' + this.cookies);
          this.debug('Get userId: ' + this.userId);
          return true;
        }
        else if (result.statusCode === 200) {
          this.log(`Couldn't authorize. Error code: "${response.code}", message: "${response.codestring}"`);
          return false;
        }
      }

      return false;
    } catch (e) {
      this.log(`Authorization failed: ${e}`);
    }
  }

  parseCookies(rawData) {
    const result = [];
    rawData.forEach(raw => {
      // if (!raw.includes('PHPSESSID', 'userAgentId')) return;
      result.push(raw.split(';')[0]);
    });
    return result.join('; ');
  }
  
  async getState() {
    try {
      const result = await this.request({
        uri: `https://developer.starline.ru/json/v2/user/${this.userId}/user_info`,
        method: 'GET',
        headers: {
          ...this.headers,
          Cookie: this.cookies
        }
      });
      let response = JSON.parse(result.body);
      if (result.statusCode === 200 && (response.code === 200 || response.codestring === 'OK')) {
        const devices = response.devices;
        const device = devices.find((element) => {
          if (element.alias === this.name) {
            return true;
          }
        });
        if (!device) {
          throw new Error('Device by specified name not found');
        }
        return device;
      }
      else if (result.statusCode === 200) {
        this.log(`user_info request returns ${response.code}, message: ${response.codestring}`);
      }
      this.debug(`GetState request returns ${result.statusCode}, body: ${result.body}`);
    } catch (e) {
      this.log(`Cannot check state: ${e}`);
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
      this.log(`Cannot execute command ${e}`);
    }
  }
}
