/**
 * Modules from the community: package.json
 */
var expect = require('chai').expect;

var integrity = require('node-integritypays');
var conf = {
    username: "_your_username_",
    password: "_your_password_"
};
var Integrity = new integrity(conf);

/**
 * Integrity test cards
CC# 5454-5454-5454-5454
EXP# 12/19
Security Code: 998

CC# 4242-4242-4242-4242
EXP# 12/20
Security Code: 999 
*/

describe('Credit Cad Methods', function ()
{
    var cardNumber = '';
    var exp = '';
    var customerId = '';
    var nameOnCard = '';
    var street = '';
    var zipcode = '';

    it('should create a credit card on integrity', function (done)
    {
        Integrity.Card.Create(cardNumber, exp, customerId, nameOnCard, street, zipcode).then(function (res)
        {
            console.log(res);

            done();
        }).catch(done);
    });
});