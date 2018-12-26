function init(hap, name) {
  const service = new hap.Service.TemperatureSensor(name);
  service
    .getCharacteristic(hap.Characteristic.CurrentTemperature)
    .setProps({
      minValue: -50
    });
  return service;
}

function update(state, service, obj) {
  service
    .getCharacteristic(obj.hap.Characteristic.CurrentTemperature)
    .updateValue(state);
}

module.exports = {
  init,
  update
}
