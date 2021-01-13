import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { MiAirPurifierAccessory } from './miAirPurrifier';
import { MiAirHumidifierAccessory } from './miAirHumidifier';

import * as mihome from 'node-mihome';
import { platform } from 'os';

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class MiHomePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
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
  configureAccessory(accessory: PlatformAccessory) {
    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  configureExistingAccessory(
    model: string, 
    accessory: PlatformAccessory, 
    device: mihome.device, 
    rawDevice: any) {
    if (model.includes('airpurifier')) {
      this.configureExistingAirPurifier(accessory, device, rawDevice);
    } else if (model.includes('humidifier')) {
      this.configureExistingAirHumidifier(accessory, device, rawDevice);
    }
  }

  configureExistingAirPurifier(accessory: PlatformAccessory, device: mihome.device, rawDevice: any) {
    new MiAirPurifierAccessory(this, accessory, device, rawDevice);
  }

  configureExistingAirHumidifier(accessory: PlatformAccessory, device: mihome.device, rawDevice: any) {
    new MiAirHumidifierAccessory(this, accessory, device, rawDevice);
  }

  configureNewAccessory(model: string, mac: string, uuid: string, device: mihome.device, rawDevice: any) {

    // create a new accessory
    const accessory = new this.api.platformAccessory(mac, uuid);
    
    if (model.includes('airpurifier')) {
      this.configureNewAirPurifier(accessory, device, rawDevice);
    } else if (model.includes('humidifier')) {
      this.configureNewAirHumidifier(accessory, device, rawDevice);
    }

    // store a copy of the device object in the `accessory.context`
    // the `context` property can be used to store any data about the accessory you may need
    accessory.context.device = rawDevice;

    // link the accessory to your platform
    this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
  }

  configureNewAirPurifier(accessory: PlatformAccessory, device: mihome.device, rawDevice: any) {

    const airPurifierService = new this.Service.AirPurifier(rawDevice.name);
    accessory.addService(airPurifierService);

    const airQualitySensor = new this.Service.AirQualitySensor(rawDevice.name);
    accessory.addService(airQualitySensor);

    const temperatureSensor = new this.Service.TemperatureSensor(rawDevice.name);
    accessory.addService(temperatureSensor);

    const humiditySensor = new this.Service.HumiditySensor(rawDevice.name);
    accessory.addService(humiditySensor);
    
    // create the accessory handler for the newly create accessory
    new MiAirPurifierAccessory(this, accessory, device, rawDevice);
  }

  configureNewAirHumidifier(accessory: PlatformAccessory, device: mihome.device, rawDevice: any) {

    this.log.info('configureNewAirHumidifier ' + rawDevice.name);

    const humidifierService = new this.Service.HumidifierDehumidifier(rawDevice.name);
    accessory.addService(humidifierService);

    const temperatureSensor = new this.Service.TemperatureSensor(rawDevice.name);
    accessory.addService(temperatureSensor);

    // create the accessory handler for the newly create accessory
    new MiAirHumidifierAccessory(this, accessory, device, rawDevice);
  }

  discoverDevices() {
    const options = { country: this.config.country };

    const getDevices = (async function (platform: MiHomePlatform) {
      mihome.miioProtocol.init();
      await mihome.miCloudProtocol.login(platform.config.login, platform.config.password);
      const rawDevices = await mihome.miCloudProtocol.getDevices(null, options);
      
      for (const rawDevice of rawDevices) {
        const model = rawDevice.model;
        const mac = rawDevice.mac;

        platform.log.info('Get device with model = ' + model);

        if (!(model.includes('airpurifier')) && !(model.includes('humidifier'))) {
          continue;
        }

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
          refresh: 30000,
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
            platform.configureExistingAccessory(model, existingAccessory, device, rawDevice);
            
            // update accessory cache with any changes to the accessory details and information
            platform.api.updatePlatformAccessories([existingAccessory]);

          } else if (!rawDevice) {
            
            // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
            // remove platform accessories when no longer present
            platform.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
            platform.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
          }

        } else {

          // the accessory does not yet exist, so we need to create it
          platform.log.info('Adding new accessory: ', mac);
  
          // create a new accessory
          platform.configureNewAccessory(model, mac, uuid, device, rawDevice);
        }
      }
    });

    getDevices(this);
  }
}
