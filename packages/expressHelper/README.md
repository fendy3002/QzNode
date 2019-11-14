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

# Filter Parser

This module / library will parse key-value query / body based on prefix, compare with supplied schema, and returning mongodb or mongoose filter (and possibly sequelize in the future).

Usage:
``` javascript
import {filterParser} from '@fendy3002/express-helper';

app.get('/', async (req, res, next) => {
    let filter = await mongoFilter(req.query, {
      "age": {
        "key": "userAge",
        "type": "number"
      }
    }, {
        prefix: "filter"
      });
    let listData = mongoModel.find(filter);
});
```

This will parse any query / body start with `filter.`, for example `filter.age` or `filter.name`. Read more on `Content` section.

## Parameters:

* `content`: key-value object. Not strictly enforced but recommend if the value is string. Usually `req.query` or `req.body`. Read more on `Content` section.
* `schema`: key-value object. The schema to define data types and filter keys. Read more on `Schema` section
* `option.prefix`: string. The prefix which part of query / body to parse (without suffix dot). The default prefix is `filter`
* `option.validateKey`: boolean, default false. If true, it will check the schema to compare. If the content key does not exists in schema, it'll throw error
* `option.notFoundKeyError`: boolean, default true. If true, it will throw error if `validateKey` option is true, and the content key does not exists in schema. Otherwise it just skip the property

## Content

Is a key-value object, and only properties with matching prefix (defined in option) are being used. For example if the prefix is `filter`, from the following `req.query` (or `req.body`) data:

``` javascript
{
    "name": "Luke Skywalker",
    "age": "15",
    "filter.category": "REGULAR",
    "filter.transactionDate": "2001-01-01"
}
```

Only 2, `filter.category` and `filter.transactionDate` that will be used as filter. There are several operations that can be used to help for conditional filter, for example in the following content:

``` javascript
{
    "filter.transactionDate.from": "2001-01-01",
    "filter.transactionDate.to": "2001-01-03"
}
```

Will result in filter logic of `transactionDate >= 2001-01-01 AND transactionDate <= 2001-01-03`. The available operations are:

* `eq`: equals. If not defined the operation will default to eq
* `ne`: not equals
* `from` or `gte`: greater than or equals
* `gt`: greater than
* `to` or `lte`: less than or equals
* `lt`: less than
* `regex`: regex comparison

## Schema

Key-value object containing the schema / data type definition. The value can be either `string` or `object`. Each content properties with matched prefix will be searched for schema. If found, it'll use the schema definition. If not found, the data type will set to `string`. If not found and `option.validateKey` is set to true, it'll throw error if `option.notFoundKeyError` is true. Otherwise the property will be skipped.

Example string schema:

```javascript
{
    "name": "name",
    "trxDate": "transactionDate"
}
```

This will keep `filter.name` property as `name`, but will change `filter.trxDate` to `transactionDate`. Useful if you want to have different query and schema property name.

```javascript
{
    "price": {
        "key": "totalPrice",
        "type": "number"
    },
    "trxDate": {
        "key": "transactionDate",
        "type": "date",
        "formatFrom": "YYYY-MM-DD",
        "formatTo": "YYYY-MM-DD HH:mm:ss"
    },
    "timestampDate": {
        "key": "transactionTimestamp",
        "type": "timestamp",
        "formatFrom": "YYYY-MM-DD"
    }
}
```