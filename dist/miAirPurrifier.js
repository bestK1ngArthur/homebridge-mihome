"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiAirPurifierAccessory = void 0;
/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
class MiAirPurifierAccessory {
    constructor(platform, accessory, device, info) {
        this.platform = platform;
        this.accessory = accessory;
        this.device = device;
        this.info = info;
        // set accessory information
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Xiaomi')
            .setCharacteristic(this.platform.Characteristic.Model, info.model)
            .setCharacteristic(this.platform.Characteristic.SerialNumber, info.mac)
            .setCharacteristic(this.platform.Characteristic.Name, info.name);
        // set Air Purifier services
        this.airPurifierService = this.accessory.getService(this.platform.Service.AirPurifier);
        this.airQualityService = this.accessory.getService(this.platform.Service.AirQualitySensor);
        this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor);
        this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor);
        // create handlers for required characteristics
        this.airPurifierService.getCharacteristic(this.platform.Characteristic.Active)
            .on('get', this.handleActiveGet.bind(this))
            .on('set', this.handleActiveSet.bind(this));
        this.airPurifierService.getCharacteristic(this.platform.Characteristic.CurrentAirPurifierState)
            .on('get', this.handleCurrentAirPurifierStateGet.bind(this));
        this.airPurifierService.getCharacteristic(this.platform.Characteristic.TargetAirPurifierState)
            .on('get', this.handleTargetAirPurifierStateGet.bind(this))
            .on('set', this.handleTargetAirPurifierStateSet.bind(this));
        this.airQualityService.getCharacteristic(this.platform.Characteristic.AirQuality)
            .on('get', this.handleAirQualityGet.bind(this));
        this.airQualityService.getCharacteristic(this.platform.Characteristic.PM2_5Density)
            .on('get', this.handlePM2_5DensityGet.bind(this));
        this.temperatureService.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
            .on('get', this.handleCurrentTemperatureGet.bind(this));
        this.humidityService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
            .on('get', this.handleCurrentRelativeHumidityGet.bind(this));
    }
    /**
     * Handle requests to get the current value of the "Active" characteristic
     */
    handleActiveGet(callback) {
        const getPower = (async function (device, platform) {
            const isOn = await device.getPower();
            if (isOn) {
                callback(null, platform.Characteristic.Active.ACTIVE);
            }
            else {
                callback(null, platform.Characteristic.Active.INACTIVE);
            }
        });
        getPower(this.device, this.platform);
    }
    /**
     * Handle requests to set the "Active" characteristic
     */
    handleActiveSet(value, callback) {
        const setPower = (async function (value, device) {
            if (value) {
                await device.setPower(true);
            }
            else {
                await device.setPower(false);
            }
            callback(null);
        });
        setPower(value, this.device);
    }
    /**
     * Handle requests to get the current value of the "Current Air Purifier State" characteristic
     */
    handleCurrentAirPurifierStateGet(callback) {
        const getMode = (async function (device, platform) {
            const isOn = await device.getPower();
            if (isOn) {
                callback(null, platform.Characteristic.CurrentAirPurifierState.PURIFYING_AIR);
            }
            else {
                callback(null, platform.Characteristic.CurrentAirPurifierState.INACTIVE);
            }
        });
        getMode(this.device, this.platform);
    }
    /**
     * Handle requests to get the current value of the "Target Air Purifier State" characteristic
     */
    handleTargetAirPurifierStateGet(callback) {
        const getMode = (async function (device, platform) {
            const mode = await device.getMode();
            if (mode === 'auto') {
                callback(null, platform.Characteristic.TargetAirPurifierState.AUTO);
            }
            else {
                callback(null, platform.Characteristic.TargetAirPurifierState.MANUAL);
            }
        });
        getMode(this.device, this.platform);
    }
    /**
     * Handle requests to set the "Target Air Purifier State" characteristic
     */
    handleTargetAirPurifierStateSet(value, callback) {
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
     * Handle requests to get the current value of the "Air Quality" characteristic
     */
    handleAirQualityGet(callback) {
        const getValue = (async function (device, platform) {
            const value = await device.getPM2_5();
            if (value < 20) {
                callback(null, platform.Characteristic.AirQuality.EXCELLENT);
            }
            else if (value < 50) {
                callback(null, platform.Characteristic.AirQuality.GOOD);
            }
            else if (value < 100) {
                callback(null, platform.Characteristic.AirQuality.FAIR);
            }
            else if (value < 150) {
                callback(null, platform.Characteristic.AirQuality.INFERIOR);
            }
            else {
                callback(null, platform.Characteristic.AirQuality.POOR);
            }
        });
        getValue(this.device, this.platform);
    }
    /**
     * Handle requests to get the current value of the "PM2.5" characteristic
     */
    handlePM2_5DensityGet(callback) {
        const getValue = (async function (device) {
            const value = await device.getPM2_5();
            callback(null, value);
        });
        getValue(this.device);
    }
    /**
     * Handle requests to get the current value of the "Current Temperature" characteristic
     */
    handleCurrentTemperatureGet(callback) {
        const getValue = (async function (device) {
            const value = await device.getTemperature();
            callback(null, value);
        });
        getValue(this.device);
    }
    /**
     * Handle requests to get the current value of the "Current Relative Humidity" characteristic
     */
    handleCurrentRelativeHumidityGet(callback) {
        const getValue = (async function (device) {
            const value = await device.getHumidity();
            callback(null, value);
        });
        getValue(this.device);
    }
}
exports.MiAirPurifierAccessory = MiAirPurifierAccessory;
//# sourceMappingURL=miAirPurrifier.js.map