import { PlatformAccessory } from 'homebridge';
import { MiAirPurifierPlatform } from './platform';
import * as mihome from 'node-mihome';
/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export declare class MiAirPurifierAccessory {
    private readonly platform;
    private readonly accessory;
    private readonly device;
    private readonly info;
    private airPurifierService;
    private airQualityService;
    private temperatureService;
    private humidityService;
    constructor(platform: MiAirPurifierPlatform, accessory: PlatformAccessory, device: mihome.Device, info: any);
    /**
     * Handle requests to get the current value of the "Active" characteristic
     */
    handleActiveGet(callback: any): void;
    /**
     * Handle requests to set the "Active" characteristic
     */
    handleActiveSet(value: any, callback: any): void;
    /**
     * Handle requests to get the current value of the "Current Air Purifier State" characteristic
     */
    handleCurrentAirPurifierStateGet(callback: any): void;
    /**
     * Handle requests to get the current value of the "Target Air Purifier State" characteristic
     */
    handleTargetAirPurifierStateGet(callback: any): void;
    /**
     * Handle requests to set the "Target Air Purifier State" characteristic
     */
    handleTargetAirPurifierStateSet(value: any, callback: any): void;
    /**
     * Handle requests to get the current value of the "Air Quality" characteristic
     */
    handleAirQualityGet(callback: any): void;
    /**
     * Handle requests to get the current value of the "PM2.5" characteristic
     */
    handlePM2_5DensityGet(callback: any): void;
    /**
     * Handle requests to get the current value of the "Current Temperature" characteristic
     */
    handleCurrentTemperatureGet(callback: any): void;
    /**
     * Handle requests to get the current value of the "Current Relative Humidity" characteristic
     */
    handleCurrentRelativeHumidityGet(callback: any): void;
}
//# sourceMappingURL=platformAccessory.d.ts.map