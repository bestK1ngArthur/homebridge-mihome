import { PlatformAccessory } from 'homebridge';
import { MiHomePlatform } from './platform';
import * as mihome from 'node-mihome';
/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export declare class MiAirHumidifierAccessory {
    private readonly platform;
    private readonly accessory;
    private readonly device;
    private readonly info;
    private humiditierService;
    private temperatureService;
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
    * Handle requests to get the current value of the "Current Humidifier State" characteristic
    */
    handleCurrentHumidifierStateGet(callback: any): void;
    /**
    * Handle requests to get the current value of the "Target Humidifier State" characteristic
    */
    handleTargetHumidifierStateGet(callback: any): void;
    /**
    * Handle requests to set the "Target Humidifier State" characteristic
    */
    handleTargetHumidifierStateSet(value: any, callback: any): void;
    /**
    * Handle requests to get the current value of the "Current Relative Humidity" characteristic
    */
    handleCurrentRelativeHumidityGet(callback: any): void;
    /**
    * Handle requests to get the current value of the "Current Temperature" characteristic
    */
    handleCurrentTemperatureGet(callback: any): void;
    /**
    * Handle requests to get the current value of the "Current Water Level" characteristic
    */
    handleCurrentWaterLevelGet(callback: any): void;
}
//# sourceMappingURL=miAirHumidifier.d.ts.map