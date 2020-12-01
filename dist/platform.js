"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiAirPurifierPlatform = void 0;
const settings_1 = require("./settings");
const platformAccessory_1 = require("./platformAccessory");
const mihome = __importStar(require("node-mihome"));
/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
class MiAirPurifierPlatform {
    constructor(log, config, api) {
        this.log = log;
        this.config = config;
        this.api = api;
        this.Service = this.api.hap.Service;
        this.Characteristic = this.api.hap.Characteristic;
        // this is used to track restored cached accessories
        this.accessories = [];
        // When this event is fired it means Homebridge has restored all cached accessories from disk.
        // Dynamic Platform plugins should only register new accessories after this event was fired,
        // in order to ensure they weren't added to homebridge already. This event can also be used
        // to start discovery of new accessories.
        this.api.on('didFinishLaunching', () => {
            // run the method to discover / register your devices as accessories
            this.discoverDevices();
        });
    }
    /**
     * This function is invoked when homebridge restores cached accessories from disk at startup.
     * It should be used to setup event handlers for characteristics and update respective values.
     */
    configureAccessory(accessory) {
        // add the restored accessory to the accessories cache so we can track if it has already been registered
        this.accessories.push(accessory);
    }
    /**
     * This is an example method showing how to register discovered accessories.
     * Accessories must only be registered once, previously created accessories
     * must not be registered again to prevent "duplicate UUID" errors.
     */
    discoverDevices() {
        const options = { country: this.config.country };
        const getDevices = (async function (platform) {
            mihome.miioProtocol.init();
            await mihome.miCloudProtocol.login(platform.config.login, platform.config.password);
            const rawDevices = await mihome.miCloudProtocol.getDevices(null, options);
            for (const rawDevice of rawDevices) {
                const model = rawDevice.model;
                const mac = rawDevice.mac;
                if (model.includes('airpurifier')) {
                    // generate a unique id for the accessory this should be generated from
                    // something globally unique, but constant, for example, the device serial
                    // number or MAC address
                    const uuid = platform.api.hap.uuid.generate(mac);
                    // see if an accessory with the same uuid has already been registered and restored from
                    // the cached devices we stored in the `configureAccessory` method above
                    const existingAccessory = platform.accessories.find(accessory => accessory.UUID === uuid);
                    const device = mihome.device({
                        id: rawDevice.did,
                        model: rawDevice.model,
                        address: rawDevice.localip,
                        token: rawDevice.token,
                        refresh: 30000
                    });
                    await device.init();
                    if (existingAccessory) {
                        // the accessory already exists
                        if (rawDevice) {
                            platform.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
                            // if you need to update the accessory.context then you should run `api.updatePlatformAccessories`. eg.:
                            // existingAccessory.context.device = device;
                            // this.api.updatePlatformAccessories([existingAccessory]);
                            // create the accessory handler for the restored accessory
                            // this is imported from `platformAccessory.ts`
                            new platformAccessory_1.MiAirPurifierAccessory(platform, existingAccessory, device, rawDevice);
                            // update accessory cache with any changes to the accessory details and information
                            platform.api.updatePlatformAccessories([existingAccessory]);
                        }
                        else if (!rawDevice) {
                            // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
                            // remove platform accessories when no longer present
                            platform.api.unregisterPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [existingAccessory]);
                            platform.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
                        }
                    }
                    else {
                        // the accessory does not yet exist, so we need to create it
                        platform.log.info('Adding new accessory: ', mac);
                        // create a new accessory
                        const accessory = new platform.api.platformAccessory(mac, uuid);
                        const airPurifierService = new platform.Service.AirPurifier(rawDevice.name);
                        accessory.addService(airPurifierService);
                        const airQualitySensor = new platform.Service.AirQualitySensor(rawDevice.name);
                        accessory.addService(airQualitySensor);
                        const temperatureSensor = new platform.Service.TemperatureSensor(rawDevice.name);
                        accessory.addService(temperatureSensor);
                        const humiditySensor = new platform.Service.HumiditySensor(rawDevice.name);
                        accessory.addService(humiditySensor);
                        // store a copy of the device object in the `accessory.context`
                        // the `context` property can be used to store any data about the accessory you may need
                        accessory.context.device = rawDevice;
                        // create the accessory handler for the newly create accessory
                        // this is imported from `platformAccessory.ts`
                        new platformAccessory_1.MiAirPurifierAccessory(platform, accessory, device, rawDevice);
                        // link the accessory to your platform
                        platform.api.registerPlatformAccessories(settings_1.PLUGIN_NAME, settings_1.PLATFORM_NAME, [accessory]);
                    }
                }
            }
        });
        getDevices(this);
    }
}
exports.MiAirPurifierPlatform = MiAirPurifierPlatform;
//# sourceMappingURL=platform.js.map