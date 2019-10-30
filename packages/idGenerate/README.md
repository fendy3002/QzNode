A tools helps to generate ID based on template or format given. Usually by adding year / month / date in it and random number. And also to generate sequential number divided by yearly / month / date.

# Installation

``` bash
$ npm i --save @fendy3002/id-generate
```

# Generate by format

``` javascript
import {generate} from '@fendy3002/id-generate';

let id = await generate("INV/{{_date('YYYY/MM')}}/{{_randomNumber(6)}}");
// id = INV/2000/03/193820
```

Generate accept `nunjucks` format as first parameter. The generate function also add some helpers that can be used by `nunjucks` started with underscore:

* `_date`: accept `moment` date format. It will return today's local date. ex: `date('YYYY/MM/DD')`
* `_randomNumber`: accept `number`, length of characters. ex: `_randomNumber(8)` for 8-characters
* `_uuid`: accept nothing. It will return randomly generated uuid

## Additional parameters

Additional parameter can be used as id generation, by injecting it as second parameter. For example:

``` javascript
import {generate} from '@fendy3002/id-generate';

let id = await generate("INV/{{tag}}/{{_date('YYYY/MM')}}/{{_randomNumber(6)}}". {tag: "CUST"});
// id = INV/CUST/2000/03/193820
```

# Generate partial

Useful for generating sequential id that can be divided by year / month / date / anything desired.

``` javascript
import {partialGenerate} from '@fendy3002/id-generate';

let id = await partialGenerate(
    "INV/{{tag}}/{{_date('YYYY/MM')}}/{{_id(4)}}/X993", 
    async (payload) => {
        // get from database based on format, or anything by desire

        return 7; // return next id / to be inserted id
    }, {
        data: {
            tag: "CUST"
        }
    });
// id = INV/CUST/2000/03/0007/X993
```

* First parameter is `nunjucks` format. It also has access to `_date` and `_randomNumber`. 
* Second parameter is next id handler. It accept a id format information and expect next (new id) to be generated as return
* Third optional parameter is option. The `data` property will be used as additional data to be rendered.

## New id handle parameter

The payload passed into second argument (handler) has properties of:

* `prefix`  : characters before id
* `suffix`  : characters after id
* `regex`   : usable regex syntax
* `sql`     : usable sql like wildcard syntax

For example, if the format is `INV/{{tag}}/{{_date('YYYY/MM')}}/{{_id(4)}}/X993`, the payload is:

* `prefix`  : INV/CUST/2019/10/
* `suffix`  : /X993
* `regex`   : INV\/CUST/2019\/10\/(\d*)\/X993
* `sql`     : INV/CUST/2019/10/%/X993