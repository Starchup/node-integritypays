/**
 * Modules from the community: package.json
 */
var expect = require('chai').expect;

var integrity = require('./integritypays.js');
var Integrity = new integrity(
{
    merchant: _merchant_id_,
    username: '_username_',
    password: '_password_',
    environment: 'sandbox'
});

var customerForeignId, cardForeignId;

describe('Customer Methods', function ()
{
    it('should create a customer on integrity', function (done)
    {
        Integrity.Customer.Create(
        {
            info:
            {
                id: 1,
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
            expect(res.foreignId).to.be.above(0);

            customerForeignId = res.foreignId;

            done();
        }).catch(done);
    });

    it('should update a customer on integrity', function (done)
    {
        Integrity.Customer.Update(
        {
            foreignKey: customerForeignId,
            info:
            {
                id: 1,
                businessName: 'MI6',
                firstName: 'James',
                lastName: 'Bond',
                phone: '(007) 007-0007',
                email: 'james@bond.com'
            }
        }).then(function (res)
        {
            expect(res.foreignId).to.be.above(0);
            done();
        }).catch(done);
    });
});

describe('Customer Methods', function ()
{
    it('should create a credit card on integrity', function (done)
    {
        Integrity.Card.Create(
        {
            foreignKey: customerForeignId,
            nameOnCard: 'Q',
            cardNumber: '5454545454545454',
            exp: '1219'
        }).then(function (res)
        {
            expect(res.foreignId).to.be.above(0);

            cardForeignId = res.foreignId;

            done();
        }).catch(done);
    });

    it('should bill a credit card on integrity', function (done)
    {
        Integrity.Card.Sale(
        {
            foreignKey: cardForeignId,
            amount: 1
        }).then(function (res)
        {
            expect(res.foreignId).to.be.above(0);
            done();
        }).catch(done);
    });
});