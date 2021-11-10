import { PlatformAccessory } from 'homebridge';
import { MiHomePlatform } from '../platform';
import * as mihome from 'node-mihome';
/**
 * Mi Air Purifier Accessory
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
    constructor(platform: MiHomePlatform, accessory: PlatformAccessory, device: mihome.Device, info: any);
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
    handleCurrentStateGet(callback: any): void;
    /**
     * Handle requests to get the current value of the "Target Air Purifier State" characteristic
     */
    handleTargetStateGet(callback: any): void;
    /**
     * Handle requests to set the "Target Air Purifier State" characteristic
     */
    handleTargetStateSet(value: any, callback: any): void;
    /**
    * Handle requests to get the current value of the "Target Air Purifier State" characteristic
    */
    handleRotationSpeedGet(callback: any): void;
    /**
     * Handle requests to set the "Target Air Purifier State" characteristic
     */
    handleRotationSpeedSet(value: any, callback: any): void;
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
//# sourceMappingURL=miAirPurrifier.d.ts.map