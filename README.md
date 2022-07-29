**This project is under construction**

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=hirle_measurements)

# Measurements

Measurementss records your sensors data into your database. Describe what your sensors are, how you would like to record them, and Measurements will faithfully fill your database.
Measurements has an UI wich intention is to let you monitor the recordings. Therefore is has not all the features a data scientist would dream off.

## Run

### Deploy

An ansible playbook is provided.

### Prepare a config file

Copy the file `config.template.json` to `ansible/installs/files/config.json` and make it yours. This looks like:
```javascript
{
  "httpPort" : 3300,
  "database" : {
    "type": "postgres",
    "config": {
      "user": "postgres",
      "password": "very.secret",
      "host": "my.host.org",
      "port": 5432,
      "database": "postgres"
    }
  }
  "sensors" : [
    { 
      "id": "my-sensor-id",
      "type" : "1wire",
      "config" : {
        "path": "/sys/bus/w1/devices/28-0414606b95ff/w1_slave"
      } 
    },
    {
      "id": "my-other-sensor-id",
      "type": "tcw122",
      "config": {
        "url": "http://192.168.0.22",
        "user": "foo",
        "password": "bar"
      }
    }
  ],
  "measurements": [
    {
      "id": "interior",
      "sensor-id": "my-sensor-id",
      "sensor-key": "Temperature2"
    },
    {
      "id": "exterior",
      "sensor-id": "my-other-sensor-id",
      "sensor-key": "Temperature1"
    }
  ],
  "recorders": [
    {
      "id": "interior-recorder",
      "measurement-id": "interior",
      "mode": "manual"
    },
    {
      "id": "interior-recorder",
      "measurement-id": "exterior",
      "mode": "periodic",
      "config" : {
        "auto-start": true,
        "period": "PT1M"
      }
    }
}
```

Period in [ISO8601](https://fr.wikipedia.org/wiki/ISO_8601) format.  Here `P30S` is 30 seconds.


## API

### Get current version

Request:

`GET /api/version`

Response:
```javascript
{
    "version": "1.2.3-alpha"
    "major" : 1,
    "minor" : 2,
    "patch" : 3,
    "opt": "alpha"
}

### Get current measurement

Request:

`GET /api/measurement/(measurement id)/current`

Response:
```javascript
{
  "supplier": {
    "id": "exterior",
    "key": "Temperature2"
  },
  "sensorValue": {
    "at": "2022-07-17T14:20:36.179Z",
    "value": 26.8
  }
}
```

### Get current status of a recorder

`GET /api/recorder/(recorder id)/status`

Response:
```javascript
{
    "recording": true,
    "location": "bedroom"
}
```

### Record a measurement

`POST /api/recorder/(recorder id)/recordOneMeasurement`

Response:
```javascript
{
  "supplier":{
    "id":"interior",
    "sensor": {
      "id":"Teracom1"
    },
    "key":"Temperature1"
  },
  "sensorValue":{
    "at":"2022-07-18T13:46:44.688Z",
    "value":24.2
  }
}
```

### Get last measurement(s) of a recorder

`GET /api/recorder/(recorder id)/measurements/latest[/(number)]`

Response:
```javascript
[
  {
    "supplier":{
      "id":"interior",
      "sensor": {
        "id":"Teracom1"
      },
      "key":"Temperature1"
    },
    "sensorValue":{
      "at":"2022-07-18T13:46:44.688Z",
      "value":24.2
    }
  },
  {
    "supplier":{
      "id":"interior",
      "sensor": {
        "id":"Teracom1"
      },
      "key":"Temperature1"
    },
    "sensorValue":{
      "at":"2022-07-18T13:47:44.688Z",
      "value":24.1
    }
}
]
```

## Miscellaneous

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="150"></p>

