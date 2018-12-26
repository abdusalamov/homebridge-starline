function init(hap, name) {
  return new hap.Service.LightSensor(name);
}

function update(state, service, obj) {
  service
    .getCharacteristic(obj.hap.Characteristic.CurrentAmbientLightLevel)
    .updateValue(state);
}

module.exports = {
  init,
  update
}
