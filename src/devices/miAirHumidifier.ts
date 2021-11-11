import { Service, PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
import { MiHomePlatform, ManufacturerName } from '../platform';

import * as mihome from 'node-mihome';
import { platform } from 'os';

/**
 * Mi Air Humidifier Accessory
 */
export class MiAirHumidifierAccessory {
  private humiditierService: Service;
  private temperatureService: Service;

  constructor(
    private readonly platform: MiHomePlatform,
    private readonly accessory: PlatformAccessory,
    private readonly device: mihome.Device,
    private readonly info: any,
  ) {
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, ManufacturerName)
      .setCharacteristic(this.platform.Characteristic.Model, info.model)
      .setCharacteristic(this.platform.Characteristic.SerialNumber, info.mac)
      .setCharacteristic(this.platform.Characteristic.Name, info.name);

    this.humiditierService = this.accessory.getService(this.platform.Service.HumidifierDehumidifier)!;
    this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor)!;

    this.humiditierService.getCharacteristic(this.platform.Characteristic.Active)
      .on('get', this.handleActiveGet.bind(this))
      .on('set', this.handleActiveSet.bind(this));

    this.humiditierService.getCharacteristic(this.platform.Characteristic.CurrentHumidifierDehumidifierState)
      .on('get', this.handleCurrentHumidifierStateGet.bind(this));

    this.humiditierService.getCharacteristic(this.platform.Characteristic.TargetHumidifierDehumidifierState)
      .on('get', this.handleTargetHumidifierStateGet.bind(this))
      .on('set', this.handleTargetHumidifierStateSet.bind(this));

    this.humiditierService.getCharacteristic(this.platform.Characteristic.RelativeHumidityHumidifierThreshold)
      .on('get', this.handleRelativeHumidityHumidifierThresholdGet.bind(this))
      .on('set', this.handleRelativeHumidityHumidifierThresholdSet.bind(this));

    this.humiditierService.getCharacteristic(this.platform.Characteristic.RotationSpeed)
      .on('get', this.handleRotationSpeedGet.bind(this))
      .on('set', this.handleRotationSpeedSet.bind(this));

    this.humiditierService.getCharacteristic(this.platform.Characteristic.WaterLevel)
      .on('get', this.handleCurrentWaterLevelGet.bind(this));

    this.humiditierService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .on('get', this.handleCurrentRelativeHumidityGet.bind(this));

    this.temperatureService.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on('get', this.handleCurrentTemperatureGet.bind(this));
  }

  /**
   * Handle requests to get the current value of the "Active" characteristic
   */
  handleActiveGet(callback) {
    const getPower = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const isOn = await device.getPower();

      if (isOn) {
        callback(null, platform.Characteristic.Active.ACTIVE);
      } else {
        callback(null, platform.Characteristic.Active.INACTIVE);
      }
    });

    getPower(this.device, this.platform);
  }

  /**
   * Handle requests to set the "Active" characteristic
   */
  handleActiveSet(value, callback) {
    const setPower = (async function (value: any, device: mihome.Device, platform: MiHomePlatform) {

      if (value == platform.Characteristic.Active.ACTIVE) {
        await device.setPower(true);
      } else {
        await device.setPower(false);
      }

      callback(null);
    });

    setPower(value, this.device, this.platform);
  }

  /**
   * Handle requests to get the current value of the "Current Humidifier State" characteristic
   */
  handleCurrentHumidifierStateGet(callback) {
    const getMode = (async function (device: mihome.Device, platform: MiHomePlatform) {
      callback(null, platform.Characteristic.CurrentHumidifierDehumidifierState.HUMIDIFYING);
    });

    getMode(this.device, this.platform);
  }

  /**
   * Handle requests to get the current value of the "Target Humidifier State" characteristic
   */
  handleTargetHumidifierStateGet(callback) {
    const getMode = (async function (device: mihome.Device, platform: MiHomePlatform) {
      callback(null, platform.Characteristic.TargetHumidifierDehumidifierState.HUMIDIFIER);
    });

    getMode(this.device, this.platform);
  }

  /**
   * Handle requests to set the "Target Humidifier State" characteristic
   */
  handleTargetHumidifierStateSet(value: any, callback) {
    const setMode = (async function () {

      // Set mode is not defined

      callback(null);
    });

    setMode();
  }

  /**
   * Handle requests to get the current value of the "Relative Humidity HumidifierT hreshold" characteristic
   */
  handleRelativeHumidityHumidifierThresholdGet(callback) {
    const getTargetHumidity = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const targetHumidity = await device.getTargetHumidity()
      callback(null, targetHumidity);
    });

    getTargetHumidity(this.device, this.platform);
  }

  /**
   * Handle requests to set the "Relative Humidity HumidifierT hreshold" characteristic
   */
  handleRelativeHumidityHumidifierThresholdSet(value: any, callback) {
    const setTargetHumidity = (async function (device: mihome.Device) {
      var targetHumidity = 40;

      if (value <= 40) {
        targetHumidity = 40;
      } else if (value > 40 && value <= 50) {
        targetHumidity = 50;
      } else if (value > 50 && value <= 60) {
        targetHumidity = 60
      } else if (value > 60) {
        targetHumidity = 70
      }

      await device.setTargetHumidity(targetHumidity);
      callback(null);
    });

    setTargetHumidity(this.device);
  }

  /**
   * Handle requests to get the current value of the "Rotation Speed" characteristic
   */
  handleRotationSpeedGet(callback) {
    const getSpeed = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const fanLevel = await device.getFanLevel();
      var rotationSpeed = 0;

      if (fanLevel == 1) {
        rotationSpeed = 100 / 3;
      } else if (fanLevel == 2) {
        rotationSpeed = 100 / 3 * 2;
      } else if (fanLevel == 3) {
        rotationSpeed = 100;
      }

      callback(null, rotationSpeed)
    });

    getSpeed(this.device, this.platform);
  }

  /**
   * Handle requests to set the "Rotation Speed" characteristic
   */
  handleRotationSpeedSet(value: any, callback) {
    const setSpeed = (async function (device: mihome.Device) {
      var fanLevel;

      if (value < (100 / 3)) {
        fanLevel = 1;
      } else if (value < (100 / 3 * 2)) {
        fanLevel = 2;
      } else {
        fanLevel = 3;
      }

      await device.setFanLevel(fanLevel)
      callback(null);
    });

    setSpeed(this.device);
  }

  /**
   * Handle requests to get the current value of the "Current Relative Humidity" characteristic
   */
  handleCurrentRelativeHumidityGet(callback) {
    const getValue = (async function (device: mihome.Device) {
      const value = await device.getHumidity();
      callback(null, value);
    });

    getValue(this.device);
  }

  /**
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  handleCurrentTemperatureGet(callback) {
    const getValue = (async function (device: mihome.Device) {
      const value = await device.getTemperature();
      callback(null, value);
    });

    getValue(this.device);
  }

  /**
   * Handle requests to get the current value of the "Current Water Level" characteristic
   */
  handleCurrentWaterLevelGet(callback) {
    const getValue = (async function (device: mihome.Device) {
      const value = await device.getWaterLevel();
      callback(null, value);
    });

    getValue(this.device);
  }
}
