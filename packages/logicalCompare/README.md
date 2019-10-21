# `$prop` block

```javascript
{
    "$prop": "total_price"
}
```

Represent / placeholder for a property. It will be replaced with property value on comparison phase. For nested value, a dot can be used. Ex:

```javascript
{
    "$prop": "item.total_price"
}
```

# `$date` block

```javascript
{
    "$date": "2000-01-01 00:00:00"
}
```

Will be replaced with date object. Use `today` or `now` as value to get today or now date.

# `$and` block

```javascript
{
    "$and": [
        { /* first condition */ },
        { /* second condition */ }
    ]
}
```

If any of condition is `false`, return `false`. Otherwise `true`.

# `$or` block

```javascript
{
    "$or": [
        { /* first condition */ },
        { /* second condition */ }
    ]
}
```

If any of condition is `true`, return `true`. Otherwise `false`.

# `$compare` block

```javascript
{
    "$compare": [
        {$prop: "check_in"}, 
        "gt", 
        {$prop: "check_out"}
    ]
}
```

Array of 3 items. The first and third parameter are the values that will be compared. The 2nd parameter is the comparison operator. Available comparison operator:

* `eq`          : equals
* `ne`          : not equals
* `gt`          : greater than
* `gte`         : greater than or equals
* `lt`          : less than
* `lte`         : less than or equals
* `starts_with` : first props starts with value
* `ends_with`   : first props ends with value
* `contains`    : first props contains specific text
* `regex`       : first props match regex expression
* `in`          : see `in` operation

## `in` operation

```javascript
{
    "$compare": [
        {$prop: "customer.type"}, 
        "in", 
        ["PREMIUM", "VIP", "VVIP"]
    ]
}
```

Same with `$compare` block, except the third element must be an array. It match (exact match) the first property with third props.

# `$between` and `$betweenEx` block

```javascript
{
    "$between": [
        "2000-01-01",
        {$prop: "promo_time"},
        "2000-03-31"
    ]
}
```

Array of 3 items. The first and third parameter are the `min` and `max` value, while the 2nd parameter is the property to compare. If the property to compare is `equal` with `min` or `max`, it resulted in true.

On the contrary, `betweenEx` (between exclude), will return false when property is equal to either `min` or `max`.

# `$datepart` block

```javascript
{
    "$datepart": {
        "of": {$prop: "promo_time"},
        "as": "day"
    }
}
```

From props given in `of` property, return the date part value defined in `as`. Supported `as` property: `year`, `month`, `day`, `hour`, `minute`.

# V2 (future plan)

## $arrpart
``` javascript
{
    "$arrpart": {
        "of": {$prop: "items"},
        "get": "length"
    }
}
```

Get operation: 
* length
* `{$sum: "prop"}`
* `{$max: "prop"}`
* `{$min: "prop"}`
* `{$avg: "prop"}`