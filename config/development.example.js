/**
 * Example Development Config
 */

module.exports = {
  "mongoose": {
    "url": "mongodb://<user>:<password>@localhost:27017/db",
    "options": {
      "db": {
        "native_parser": true
      },
      "server": {
        "auto_reconnect": true
      },
      "replset": {
        "strategy": "ping",
        "rs_name": "testSet"
      }
    }
  },
  "nutritionix": {
    "appId": "YOUR_APP_ID",
    "appKey": "YOUR_APP_KEY"
  }
}