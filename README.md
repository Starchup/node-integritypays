node-integritypays
==================
IntegrityPays API wrapper for Node.js, fully promisified

## Functionality
* Card Not Present
	* Card tokenization (`StoreCardAsync` API)
	* Sale with card token (`ProcessCreditCardAsync` API)
	* Void sale (`ProcessCreditCardAsync` API)
        * Statuses accepted: `Approved`
	* Refund amount (`ProcessCreditCardAsync` API)
        * Statuses accepted: `Approved`
 * Customer management
	 * Create (`ManageCustomerAsync` API)
	 * Update (`ManageCustomerAsync` API)
	 * GetCards (`GetCustomerPaymentMethodsAsync` API)

## Updating the framework
* `git tag x.x.x`
* `git push --tags`
* `nom publish`
* 
## Initialization

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

## Usage
See tests https://github.com/Starchup/node-integritypays/blob/master/test.js
