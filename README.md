# node-integritypays
Integritypays API wrapper for Node.js, fully promisified

#### Initialization

```
var integrity = require('node-integritypays');
var conf = {
    username: '_your_username_',
    password: '_your_password_'
    merchant: _your_merchant_,
    environment: 'sandbox'
};
var Integrity = new integrity(conf);
```

#### Usage

```
Integrity.Customer.Create(
{
    info:
    {
        id: 7,
        businessName: 'MI6',
        firstName: 'James',
        lastName: 'Bond',
        phone: '(007) 007-0007',
        email: 'james@bond.com'
    },
    address:
    {
        street: '1 Secret Avenue',
        unit: '0',
        city: 'London'
    }
}).then(function (res)
{
    // Mission success
}).catch(function (err)
{
    // Bond blew things up
});
```
```
Integrity.Customer.Update(
{
    foreignKey: 318,
    info:
    {
        id: 7,
        businessName: 'MI6',
        firstName: 'James',
        lastName: 'Smith'
    }
});
```
```
Integrity.Card.Create(
{
    foreignKey: 318,

    nameOnCard: 'Q',
    cardNumber: '_sandbox_card_number_',
    exp: '01/99'
});
```