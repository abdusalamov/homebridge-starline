function init(hap, name) {
  return new hap.Service.MotionSensor(name);
}

function update(state, service, obj) {
  service
    .getCharacteristic(obj.hap.Characteristic.MotionDetected)
    .updateValue(state);
}

module.exports = {
  init,
  update
}
