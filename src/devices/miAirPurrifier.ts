import { Service, PlatformAccessory, CharacteristicValue, CharacteristicSetCallback, CharacteristicGetCallback } from 'homebridge';
import { MiHomePlatform, ManufacturerName } from '../platform';

import * as mihome from 'node-mihome';

/**
 * Mi Air Purifier Accessory
 */
export class MiAirPurifierAccessory {
  private airPurifierService: Service;
  private airQualityService: Service;
  private temperatureService: Service;
  private humidityService: Service;
  private filterService: Service;

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

    this.airPurifierService = this.accessory.getService(this.platform.Service.AirPurifier)!;
    this.airQualityService = this.accessory.getService(this.platform.Service.AirQualitySensor)!;
    this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor)!;
    this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor)!;
    this.filterService = this.accessory.getService(this.platform.Service.FilterMaintenance)!;

    this.airPurifierService.getCharacteristic(this.platform.Characteristic.Active)
      .on('get', this.handleActiveGet.bind(this))
      .on('set', this.handleActiveSet.bind(this));

    this.airPurifierService.getCharacteristic(this.platform.Characteristic.CurrentAirPurifierState)
      .on('get', this.handleCurrentStateGet.bind(this));

    this.airPurifierService.getCharacteristic(this.platform.Characteristic.TargetAirPurifierState)
      .on('get', this.handleTargetStateGet.bind(this))
      .on('set', this.handleTargetStateSet.bind(this));

    this.airPurifierService.getCharacteristic(this.platform.Characteristic.RotationSpeed)
      .on('get', this.handleRotationSpeedGet.bind(this))
      .on('set', this.handleRotationSpeedSet.bind(this));

    this.airPurifierService.getCharacteristic(this.platform.Characteristic.LockPhysicalControls)
      .on('get', this.handleLockPhysicalControlsGet.bind(this))
      .on('set', this.handleLockPhysicalControlsSet.bind(this));

    this.airQualityService.getCharacteristic(this.platform.Characteristic.AirQuality)
      .on('get', this.handleAirQualityGet.bind(this));

    this.airQualityService.getCharacteristic(this.platform.Characteristic.PM2_5Density)
      .on('get', this.handlePM2_5DensityGet.bind(this));

    this.temperatureService.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on('get', this.handleCurrentTemperatureGet.bind(this));

    this.humidityService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .on('get', this.handleCurrentRelativeHumidityGet.bind(this));

    this.filterService.getCharacteristic(this.platform.Characteristic.FilterChangeIndication)
      .on('get', this.handleFilterChangeIndicationGet.bind(this));

    this.filterService.getCharacteristic(this.platform.Characteristic.FilterLifeLevel)
      .on('get', this.handleFilterLifeLevelGet.bind(this));
  }

  /**
   * Handle requests to get the current value of the "Active" characteristic
   */
  handleActiveGet(callback: any) {
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
  handleActiveSet(value: any, callback: any) {
    const setPower = (async function (value: boolean, device: mihome.Device) {

      if (value) {
        await device.setPower(true);
      } else {
        await device.setPower(false);
      }

      callback(null);
    });

    setPower(value, this.device);
  }

  /**
   * Handle requests to get the current value of the "Current State" characteristic
   */
  handleCurrentStateGet(callback: any) {
    const getMode = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const isOn = await device.getPower();

      if (isOn) {
        callback(null, platform.Characteristic.CurrentAirPurifierState.PURIFYING_AIR);
      } else {
        callback(null, platform.Characteristic.CurrentAirPurifierState.INACTIVE);
      }
    });

    getMode(this.device, this.platform);
  }

  /**
   * Handle requests to get the current value of the "Target State" characteristic
   */
  handleTargetStateGet(callback: any) {
    const getMode = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const mode = await device.getMode();

      if (mode === 'auto') {
        callback(null, platform.Characteristic.TargetAirPurifierState.AUTO);
      } else {
        callback(null, platform.Characteristic.TargetAirPurifierState.MANUAL);
      }
    });

    getMode(this.device, this.platform);
  }

  /**
   * Handle requests to set the "Target State" characteristic
   */
  handleTargetStateSet(value: any, callback: any) {
    const setMode = (async function () {

      // Set mode is not defined
      // if (value == platform.Characteristic.TargetAirPurifierState.AUTO) {
      //   await device.setMode("auto");
      // } else {
      //   await device.setMode("favorite");
      // }

      callback(null);
    });

    setMode();
  }

  /**
   * Handle requests to get the current value of the "Rotation Speed" characteristic
   */
  handleRotationSpeedGet(callback: any) {
    const getSpeed = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const fanLevel = await device.getFanLevel();
      let rotationSpeed = 0;

      if (fanLevel == 1) {
        rotationSpeed = 100 / 3;
      } else if (fanLevel == 2) {
        rotationSpeed = 100 / 3 * 2;
      } else if (fanLevel == 3) {
        rotationSpeed = 100;
      }

      callback(null, rotationSpeed);
    });

    getSpeed(this.device, this.platform);
  }

  /**
   * Handle requests to set the "Rotation Speed" characteristic
   */
  handleRotationSpeedSet(value: any, callback: any) {
    const setSpeed = (async function (device: mihome.Device) {
      let fanLevel;

      if (value < (100 / 3)) {
        fanLevel = 1;
      } else if (value < (100 / 3 * 2)) {
        fanLevel = 2;
      } else {
        fanLevel = 3;
      }

      await device.setFanLevel(fanLevel);
      callback(null);
    });

    setSpeed(this.device);
  }

  /**
   * Handle requests to get the current value of the "Lock Physical Controls" characteristic
   */
  handleLockPhysicalControlsGet(callback: any) {
    const getControlsLocked = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const controlsLocked = await device.getControlsLocked();

      if (controlsLocked) {
        callback(null, platform.Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED);
      } else {
        callback(null, platform.Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED);
      }
    });

    getControlsLocked(this.device, this.platform);
  }

  /**
   * Handle requests to set the "Lock Physical Controls" characteristic
   */
  handleLockPhysicalControlsSet(value: any, callback: any) {
    const setControlsLocked = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const controlsLocked: boolean = value == platform.Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
      await device.setControlsLocked(controlsLocked);
      callback(null);
    });

    setControlsLocked(this.device, this.platform);
  }

  /**
   * Handle requests to get the current value of the "Air Quality" characteristic
   */
  handleAirQualityGet(callback: any) {
    const getValue = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const value = await device.getPM2_5();

      if (value < 20) {
        callback(null, platform.Characteristic.AirQuality.EXCELLENT);
      } else if (value < 50) {
        callback(null, platform.Characteristic.AirQuality.GOOD);
      } else if (value < 100) {
        callback(null, platform.Characteristic.AirQuality.FAIR);
      } else if (value < 150) {
        callback(null, platform.Characteristic.AirQuality.INFERIOR);
      } else {
        callback(null, platform.Characteristic.AirQuality.POOR);
      }
    });

    getValue(this.device, this.platform);
  }

  /**
   * Handle requests to get the current value of the "PM2.5" characteristic
   */
  handlePM2_5DensityGet(callback: any) {
    const getValue = (async function (device: mihome.Device) {
      const value = await device.getPM2_5();
      callback(null, value);
    });

    getValue(this.device);
  }

  /**
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  handleCurrentTemperatureGet(callback: any) {
    const getValue = (async function (device: mihome.Device) {
      const value = await device.getTemperature();
      callback(null, value);
    });

    getValue(this.device);
  }

  /**
   * Handle requests to get the current value of the "Current Relative Humidity" characteristic
   */
  handleCurrentRelativeHumidityGet(callback: any) {
    const getValue = (async function (device: mihome.Device) {
      const value = await device.getHumidity();
      callback(null, value);
    });

    getValue(this.device);
  }

  /**
   * Handle requests to get the current value of the "Filter Change Indication" characteristic
   */
  handleFilterChangeIndicationGet(callback: any) {
    const getValue = (async function (device: mihome.Device, platform: MiHomePlatform) {
      const filterRemaining = await device.getFilterRemaining();

      // If < 5% remaining, push indication to change
      if (filterRemaining < 5) {
        callback(null, platform.Characteristic.FilterChangeIndication.CHANGE_FILTER);
        return;
      }

      callback(null, platform.Characteristic.FilterChangeIndication.FILTER_OK);
    });

    getValue(this.device, this.platform);
  }

  /**
   * Handle requests to get the current value of the "Filter Life Level" characteristic
   */
  handleFilterLifeLevelGet(callback: any) {
    const getValue = (async function (device: mihome.Device, platform: MiHomePlatform) {
      let filterRemaining = await device.getFilterRemaining();

      if (filterRemaining == undefined) {
        filterRemaining = 100;
      }

      callback(null, 100 - filterRemaining);
    });

    getValue(this.device, this.platform);
  }
}
