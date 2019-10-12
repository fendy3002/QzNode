Lang is a small library to handle language with key-value format. 

# Installing

For the latest version:

```bash
$ npm install @fendy3002/lang
```

Or using yarn:

```bash
$ yarn add @fendy3002/lang
```

# Usage

This library accept a javascript object / json. Example of a language dictionary that can be supplied:

``` javascript
let dictionary = {
    "en": {
        "sales": {
            "create": {
                "created": "Your order has been created with number {order_id}",
                "customer_blocked": "Customer {customer} is blocked"
            },
            "delete": {
                "confirm": "Are you sure to delete order {order_id}?",
                "deleted": "Order has been deleted"
            }
        },
        "parameterized": "Age: {age}"
    }
};
```

The nested content can have more than 2 levels deep. To use the dictionary variable above (with async/await):

``` javascript
import langCore from '@fendy3002/lang';
let langSource = await langCore(dictionary);
let langEn = langSource.use("en");

let createdDefaultMessage = "Created successfully, order no: {order_id}";
let createdMessage = langEn._(
    "sales.create.created", 
    createdDefaultMessage, {
        order_id: "ORD/XII/1241"
    });
```

If you want to shorten / simplify the nested path, `part` method can be used:

```javascript
let langSource = await langCore(dictionary);
let langEn = langSource.use("en");

let salesCreate = langEn.part("sales.create");
let createdDefaultMessage = "Created successfully, order no: {order_id}";
let createdMessage = langEn._(
    "created", 
    createdDefaultMessage, {
        order_id: "ORD/XII/1241"
    });
```

For the moment, to use parameter as replacement you can use `{key}` format, and supply the values as third parameter.

# Express middleware

To use this library under express, it can be passed using middleware. For example, to use specific language dictionary using first segment of url (ex: `http://example.com/en/sales/created`):

``` javascript
let langSource = await langCore(dictionary);

app.use(":lang", (req, res, next) => {
    req.lang = langSource.use(req.params.lang);
});
app.get(":lang/sales/created", (req, res, next) => {
    let pageLang = req.lang.part("sales.create");
    let createdDefaultMessage = "Created successfully, order no: {order_id}";
    let createdMessage = pageLang._("created", createdDefaultMessage, {
        order_id: "ORD/XII/1241"
    });
});
```