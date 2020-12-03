# Mi Air Purifier Plugin

Control Mi Air Purifiers via homebridge. No need to get device token.

## Tested devices

- [x]  **Mi Air Purifier 3** (zhimi.airpurifier.ma4)

## Install

1. Install node package.

```
npm install -g git+https://github.com/bestK1ngArthur/homebridge-mi-air-purifier
```

2. Add platform to config.
```
"platforms": [
  {
    "platform": "MiAirPurifierPlugin",
    "login": "PHONE (+XXXXXXXXXXX) or EMAIL",
    "password": "PASSWORD",
    "country": "cn"
  }
]
```

3. Restart homebridge server.
