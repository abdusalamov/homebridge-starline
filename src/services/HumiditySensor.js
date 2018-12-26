function init(hap, name) {
  return new hap.Service.HumiditySensor(name);
}

function update(state, service, obj) {
  service
    .getCharacteristic(obj.hap.Characteristic.CurrentRelativeHumidity)
    .updateValue(state);
}

module.exports = {
  init,
  update
}
