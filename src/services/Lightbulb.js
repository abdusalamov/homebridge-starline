function init(hap, name) {
  const service = new hap.Service.Lightbulb(name);
  service.getCharacteristic(hap.Characteristic.On);

  return service;
}

function update(state, service, obj) {
  service
    .getCharacteristic(obj.hap.Characteristic.On)
    .updateValue(!!state);
}

module.exports = {
  init,
  update
}
