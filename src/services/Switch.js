function init(hap, name, key, remote) {
  const service = new hap.Service.Switch(name);
  service.getCharacteristic(hap.Characteristic.On)
    .on('set', setSwitch.bind(this, hap, remote, service, key));

  return service;
}

function update(state, service, obj) {
  service
    .getCharacteristic(obj.hap.Characteristic.On)
    .updateValue(state);
}

async function setSwitch(hap, remote, service, key, value, callback) {
  // this.log(`${key} - ${value}`);
  try {
    const result = await remote.executeCommand(key, value);
    let newState = value;
    if (result) {
      newState = !value
    }
    service.getCharacteristic(hap.Characteristic.On).updateValue(newState);

    return callback(null, newState);
  } catch (e) {
    service.getCharacteristic(hap.Characteristic.On).updateValue(!value);

    return callback(true);
  }
}

module.exports = {
  init,
  update
}
