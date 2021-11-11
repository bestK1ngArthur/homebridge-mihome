import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import * as mihome from 'node-mihome';
export declare const ManufacturerName = "Xiaomi";
/**
 * Mi Home Platform
 */
export declare class MiHomePlatform implements DynamicPlatformPlugin {
    readonly log: Logger;
    readonly config: PlatformConfig;
    readonly api: API;
    readonly Service: typeof Service;
    readonly Characteristic: typeof Characteristic;
    readonly accessories: PlatformAccessory[];
    constructor(log: Logger, config: PlatformConfig, api: API);
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory: PlatformAccessory): void;
    configureExistingAccessory(model: string, accessory: PlatformAccessory, device: mihome.device, rawDevice: any): void;
    configureExistingAirPurifier(accessory: PlatformAccessory, device: mihome.device, rawDevice: any): void;
    configureExistingAirHumidifier(accessory: PlatformAccessory, device: mihome.device, rawDevice: any): void;
    configureNewAccessory(model: string, mac: string, uuid: string, device: mihome.device, rawDevice: any): void;
    configureNewAirPurifier(accessory: PlatformAccessory, device: mihome.device, rawDevice: any): void;
    configureNewAirHumidifier(accessory: PlatformAccessory, device: mihome.device, rawDevice: any): void;
    discoverDevices(): void;
}
//# sourceMappingURL=platform.d.ts.map