# Mi Air Purifier Plugin

Control MiHome devices via homebridge. No need to get device token.

## Tested devices

### Air Purifiers

- [x]  **Mi Air Purifier 3** (zhimi.airpurifier.ma4)

### Air Humidifiers

- [x]  **Mi Smart Humidifier** (deerma.humidifier.mjjsq)

## Install

1. Install node package.

```
npm install -g git+https://github.com/bestK1ngArthur/homebridge-mihome
```

2. Add platform to config.
```
"platforms": [
  {
    "platform": "MiHomePlatform",
    "login": "PHONE (+XXXXXXXXXXX) or EMAIL",
    "password": "PASSWORD",
    "country": "cn"
  }
]
```

3. Restart homebridge server.
