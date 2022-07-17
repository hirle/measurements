**This project is under construction**

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/summary/new_code?id=hirle_measures)

# Measures

Measures records data from your sensors into your database. Describe what your sensors are, how you would like to record them, and Measures will faithfully fill your database.
Measures has an UI wich intention is to let you monitor your recordings are running well. Therefore is has not all the features a data scientist would dream off.

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
      "recording": {
        "auto-start": true
        "period" : "PT30S",
      },
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

### Get current measurement from a sensor

Request:

`GET /api/measurement/(measurement id)/current`

Response:
```javascript
{
    "timestamp": "2020-04-09T21:33:22Z",
    "value": "12.125"
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

## Miscellaneous

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="150"></p>

