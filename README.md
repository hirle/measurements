**This project is under construction**

# Measures

Measures records data from your sensors into your database. It gives control as, describe what your sensors are, how you would like to record them, and Measures will faithfully fill your database.
Measures has a UI which intention is to let you make sure the recording goes well. It therefore has not all the features a data scientist would like to have.

## Run

### Deploy

An ansible playbook is provided. It has a role `node16`,

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
    "my-sensor-id": { 
      "type" : "1wire",
      "period" : "PT30S",
      "config" : {
        "path": "/sys/bus/w1/devices/28-0414606b95ff/w1_slave"
      } 
    },
    "my-other-sensor-id": { 
      "type" : "tcw122",
      "period" : "PT1M",
      "config" : {
        "host": "192.168.0.22"
        "user": "foo"
        "password": "bar"
      } 
    }
  ]
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

### Get current value of a sensor

Request:

`GET /api/sensor/(sensor id)/current`

Response:
```javascript
{
    "timestamp": "2020-04-09T21:33:22Z",
    "value": "12.125"
}
```

### Get current status of a sensor

`GET /api/sensor(sensor id)/status`

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

