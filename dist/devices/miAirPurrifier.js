"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiAirPurifierAccessory = void 0;
const platform_1 = require("../platform");
/**
 * Mi Air Purifier Accessory
 */
class MiAirPurifierAccessory {
    constructor(platform, accessory, device, info) {
        this.platform = platform;
        this.accessory = accessory;
        this.device = device;
        this.info = info;
        this.accessory.getService(this.platform.Service.AccessoryInformation)
            .setCharacteristic(this.platform.Characteristic.Manufacturer, platform_1.ManufacturerName)
            .setCharacteristic(this.platform.Characteristic.Model, info.model)
            .setCharacteristic(this.platform.Characteristic.SerialNumber, info.mac)
            .setCharacteristic(this.platform.Characteristic.Name, info.name);
        this.airPurifierService = this.accessory.getService(this.platform.Service.AirPurifier);
        this.airQualityService = this.accessory.getService(this.platform.Service.AirQualitySensor);
        this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor);
        this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor);
        this.filterService = this.accessory.getService(this.platform.Service.FilterMaintenance);
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
     * Handle requests to get the current value of the "Current State" characteristic
     */
    handleCurrentStateGet(callback) {
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
     * Handle requests to get the current value of the "Target State" characteristic
     */
    handleTargetStateGet(callback) {
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
     * Handle requests to set the "Target State" characteristic
     */
    handleTargetStateSet(value, callback) {
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
    handleRotationSpeedGet(callback) {
        const getSpeed = (async function (device, platform) {
            const fanLevel = await device.getFanLevel();
            let rotationSpeed = 0;
            if (fanLevel == 1) {
                rotationSpeed = 100 / 3;
            }
            else if (fanLevel == 2) {
                rotationSpeed = 100 / 3 * 2;
            }
            else if (fanLevel == 3) {
                rotationSpeed = 100;
            }
            callback(null, rotationSpeed);
        });
        getSpeed(this.device, this.platform);
    }
    /**
     * Handle requests to set the "Rotation Speed" characteristic
     */
    handleRotationSpeedSet(value, callback) {
        const setSpeed = (async function (device) {
            let fanLevel;
            if (value < (100 / 3)) {
                fanLevel = 1;
            }
            else if (value < (100 / 3 * 2)) {
                fanLevel = 2;
            }
            else {
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
    handleLockPhysicalControlsGet(callback) {
        const getControlsLocked = (async function (device, platform) {
            const controlsLocked = await device.getControlsLocked();
            if (controlsLocked) {
                callback(null, platform.Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED);
            }
            else {
                callback(null, platform.Characteristic.LockPhysicalControls.CONTROL_LOCK_DISABLED);
            }
        });
        getControlsLocked(this.device, this.platform);
    }
    /**
     * Handle requests to set the "Lock Physical Controls" characteristic
     */
    handleLockPhysicalControlsSet(value, callback) {
        const setControlsLocked = (async function (device, platform) {
            const controlsLocked = value == platform.Characteristic.LockPhysicalControls.CONTROL_LOCK_ENABLED;
            await device.setControlsLocked(controlsLocked);
            callback(null);
        });
        setControlsLocked(this.device, this.platform);
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
    /**
     * Handle requests to get the current value of the "Filter Change Indication" characteristic
     */
    handleFilterChangeIndicationGet(callback) {
        const getValue = (async function (device, platform) {
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
    handleFilterLifeLevelGet(callback) {
        const getValue = (async function (device, platform) {
            let filterRemaining = await device.getFilterRemaining();
            if (filterRemaining == undefined) {
                filterRemaining = 100;
            }
            callback(null, 100 - filterRemaining);
        });
        getValue(this.device, this.platform);
    }
}
exports.MiAirPurifierAccessory = MiAirPurifierAccessory;
//# sourceMappingURL=miAirPurrifier.js.map