/**
 * Modules from the community: package.json
 */
var expect = require('chai').expect;

var integrity = require('./integritypays.js');
var Integrity = new integrity(
{
    merchant: _merchant_id_,
    username: 'star4100',
    password: 'Partner1',
    environment: 'sandbox'
});

var customerForeignId, cardForeignId, transactionForeignId;

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
        }).then(function (foreignId)
        {
            expect(foreignId).to.be.above(0);
            customerForeignId = foreignId;
            console.log(customerForeignId);
            done();
        }).catch(done);
    });

    // it('should update a customer on integrity', function (done)
    // {
    //     Integrity.Customer.Update(
    //     {
    //         foreignKey: customerForeignId,
    //         info:
    //         {
    //             id: 1,
    //             businessName: 'MI6',
    //             firstName: 'James',
    //             lastName: 'Bond',
    //             phone: '(007) 007-0007',
    //             email: 'james@bond.com'
    //         }
    //     }).then(function (foreignId)
    //     {
    //         expect(foreignId).to.be.above(0);
    //         done();
    //     }).catch(done);
    // });
});

describe('Card Methods', function ()
{
    it('should create a credit card on integrity', function (done)
    {
        Integrity.Card.Create(
        {
            foreignKey: customerForeignId,
            nameOnCard: 'Q',
            cardNumber: '5454545454545454',
            exp: '1219'
        }).then(function (cardData)
        {
            expect(cardData).to.exist; // jshint ignore:line
            expect(cardData.foreignId).to.be.above(0);

            cardForeignId = cardData.foreignId;

            done();
        }).catch(done);
    });

    // it('should get a credit card from integrity', function (done)
    // {
    //     Integrity.Customer.GetCards(
    //     {
    //         foreignKey: customerForeignId

    //     }).then(function (res)
    //     {
    //         expect(res.length).to.be.above(0);
    //         done();
    //     }).catch(done);
    // });

    // it('should bill a credit card on integrity', function (done)
    // {
    //     Integrity.Card.Sale(
    //     {
    //         foreignKey: cardForeignId,
    //         amount: 1
    //     }).then(function (saleData)
    //     {
    //         expect(saleData).to.exist;
    //         expect(saleData.foreignId).to.be.above(0);
    //
    //         transactionForeignId = saleData.foreignId;
    //
    //         done();
    //     }).catch(done);
    // });

    // it('should refund a credit card on integrity', function (done)
    // {
    //     Integrity.Card.Refund(
    //     {
    //         foreignKey: cardForeignId,
    //         transactionForeignKey: transactionForeignId,
    //         amount: 0.5
    //     }).then(function (refundData)
    //     {
    //         expect(refundData).to.exist;
    //         expect(refundData.foreignId).to.be.above(0);
    //         done();
    //     }).catch(done);
    // });

    // it('should void a credit card on integrity', function (done)
    // {
    //     Integrity.Card.Void(
    //     {
    //         foreignKey: cardForeignId,
    //         transactionForeignKey: transactionForeignId
    //     }).then(function (voidData)
    //     {
    //         expect(voidData).to.exist;
    //         expect(voidData.foreignId).to.be.above(0);
    //         done();
    //     }).catch(done);
    // });
});