# node-integritypays
Integritypays API wrapper for Node.js, fully promisified

#### Initialization

```
var integrity = require('node-integritypays');
var conf = {
    username: "your_username",
    password: "your_password"
};
var Integrity = new integrity(conf);
```