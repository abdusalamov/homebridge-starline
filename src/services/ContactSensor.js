function init(hap, name) {
  return new hap.Service.ContactSensor(name);
}

function update(state, service, obj) {
  service
    .getCharacteristic(obj.hap.Characteristic.ContactSensorState)
    .updateValue(!state ? obj.hap.Characteristic.ContactSensorState.CONTACT_DETECTED : obj.hap.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED);
}

module.exports = {
  init,
  update
}
