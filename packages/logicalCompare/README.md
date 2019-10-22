
# blocks


# `$prop` block

JSON:
```javascript
{
    "$prop": "total_price"
}
```
YAML:
``` yaml
  $prop: "total_price"
```

Represent / placeholder for a property. It will be replaced with property value on comparison phase. For nested value, a dot can be used. Ex:

JSON:
```javascript
{
    "$prop": "item.total_price"
}
```

# `$date` block

JSON:
```javascript
{
    "$date": "2000-01-01 00:00:00"
}
```
YAML:
```yaml
  $date: "2000-01-01 00:00:00"
```

Will be replaced with date object. Use `today` or `now` as value to get today or now date. Can also use `$prop` block.

JSON:
```javascript
{
    "$date": {
        "$prop": "birth"
    }
}
```
YAML:
```yaml
  $date: 
    $prop: "birth"
```

# `$and` block

JSON:
```javascript
{
    "$and": [
        { /* first condition */ },
        { /* second condition */ }
    ]
}
```
YAML:
```yaml
  $and:
    - /*first_condition*/
    - /*second_condition*/
```

If any of condition is `false`, return `false`. Otherwise `true`.

# `$or` block

JSON:
```javascript
{
    "$or": [
        { /* first condition */ },
        { /* second condition */ }
    ]
}
```
YAML:
```yaml
  $or:
    - /*first_condition*/
    - /*second_condition*/
```

If any of condition is `true`, return `true`. Otherwise `false`.

# `$compare` block

JSON:
```javascript
{
    "$compare": [
        {$prop: "check_in"}, 
        "gt", 
        {$prop: "check_out"}
    ]
}
```
YAML:
```yaml
  $compare:
    - $prop: "check_in" 
    - "gt"
    - $prop: "check_out"
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

JSON:
```javascript
{
    "$compare": [
        {$prop: "customer.type"}, 
        "in", 
        ["PREMIUM", "VIP", "VVIP"]
    ]
}
```
YAML:
```yaml
  $compare:
    - $prop: "customer.type" 
    - "in"
    - ["PREMIUM", "VIP", "VVIP"]
    
```

Same with `$compare` block, except the third element must be an array. It match (exact match) the first property with third props.

# `$between` and `$betweenEx` block

JSON:
```javascript
{
    "$between": [
        {$date: "2000-01-01"},
        {$date: {$prop: "promo_time"} },
        {$date: "2000-03-31"}
    ]
}
```
YAML:
```yaml
  $between:
    - $date: "2000-01-01"
    - $date:
        $prop: "promo_time"
    - $date: "2000-03-31"
```

Array of 3 items. The first and third parameter are the `min` and `max` value, while the 2nd parameter is the property to compare. If the property to compare is `equal` with `min` or `max`, it resulted in true.

On the contrary, `betweenEx` (between exclude), will return false when property is equal to either `min` or `max`.

# V2 (future plan)

## `$datepart` block

```javascript
{
    "$datepart": {
        "of": {$prop: "promo_time"},
        "as": "day"
    }
}
```

From props given in `of` property, return the date part value defined in `as`. Supported `as` property: `year`, `month`, `day`, `hour`, `minute`.

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