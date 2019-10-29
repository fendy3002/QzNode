A set of utility tools for express server

# Installation

With NPM: 

``` bash
$ npm install --save @fendy3002/express-helper
```

Or using yarn :

``` bash
$ yarn add @fendy3002/express-helper
```

# Healthcheck


* Add Health Endpoint

`GET /~/health`

Only checks whether the application server is running. It does not verify whether database or other services are running. A successful response will return a 204 status code without content

* Add Readiness Endpoint

`GET /~/readiness`

Check whether database or other services are running. Usually used at startup to check whether required services are already up, for example is database.
Or whether something happen to services when the server produce an error.

```javascript
import {healthCheck} from '@fendy3002/express-helper';

app.use(healthCheck{
    mongo: async (req, res) => {
        await mongoose.connection.db.admin().ping();
        return;
    },
    // default 10000 or 10 secs
    checkTimeout: 10000
})
```

