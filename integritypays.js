/**
 * Modules from the community: package.json
 */
var soap = require('soap');

var production = 'https://gateway.ibxpays.com/';
var sandbox = 'https://sandbox.ibxpays.com/';

/**
 * Constructor
 */
var integritypays = function (config)
{
    var self = this;

    self.Card = {
        // https://www.integritypays.com/developers/apis/soap-apis/#storecard
        Create: function (options)
        {
            if (!self.Customer.client) return wait(self.Card.Create, options);

            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.foreignKey, 'options.foreignKey');
            self.Util.validateArgument(options.cardNumber, 'options.cardNumber');
            self.Util.validateArgument(options.exp, 'options.exp');

            var query = {
                UserName: self.CONFIG.username,
                Password: self.CONFIG.password,

                TokenMode: 'DEFAULT',

                CustomerKey: options.foreignKey,
                CardNum: options.cardNumber,
                ExpDate: options.exp,

                NameOnCard: options.nameOnCard,
                Street: options.street,
                Zip: options.zipcode,
            };

            self.Util.fillFieldsIfEmpty(query, [
                'NameOnCard',
                'Street',
                'Zip',
                'ExtData'
            ]);

            return self.Card.client.StoreCardAsync(query).then(function (res)
            {
                if (!res || !res.StoreCardResult)
                {
                    self.Util.throwInvalidDataError(res);
                }

                res = res.StoreCardResult;
                if (!res.ExtData)
                {
                    if (res.RespMSG) throw new Error(res.RespMSG);
                    self.Util.throwInvalidDataError(res);
                }

                // Manually parse some tidbit of unparsed XML
                return {
                    foreignId: res.ExtData.replace("<CardSafeToken>", "").replace("</CardSafeToken>", "")
                };
            });
        },
        // https://www.integritypays.com/developers/apis/soap-apis/#processcreditcard-2
        Sale: function (options)
        {
            if (!self.Customer.client) return wait(self.Card.Sale, options);

            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.foreignKey, 'options.foreignKey');
            self.Util.validateArgument(options.amount, 'options.amount');

            var query = {
                UserName: self.CONFIG.username,
                Password: self.CONFIG.password,

                TransType: 'Sale',
                TokenMode: 'DEFAULT',

                CardToken: options.foreignKey,
                Amount: options.amount,
            };

            self.Util.fillFieldsIfEmpty(query, [
                'InvNum',
                'PNRef',
                'ExtData'
            ]);

            return self.Card.client.ProcessCreditCardAsync(query).then(function (res)
            {
                if (!res || !res.ProcessCreditCardResult)
                {
                    self.Util.throwInvalidDataError(res);
                }

                res = res.ProcessCreditCardResult;
                if (!res.PNRef || !res.HostCode || !res.AuthCode)
                {
                    self.Util.throwInvalidDataError(res);
                }

                return {
                    foreignId: res.PNRef
                };
            });
        },
    };

    self.Customer = {
        // https://www.integritypays.com/developers/apis/soap-apis/#managecustomer
        Create: function (options)
        {
            if (!self.Customer.client) return wait(self.Customer.Create, options);

            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.info, 'options.info');
            self.Util.validateArgument(options.info.id, 'options.info.id');
            self.Util.validateArgument(options.info.businessName, 'options.info.businessName');

            var query = {
                Username: self.CONFIG.username,
                Password: self.CONFIG.password,
                Vendor: self.CONFIG.merchant,

                TransType: 'ADD',

                CustomerID: options.info.id,
                CustomerName: options.info.businessName,

                FirstName: options.info.firstName,
                LastName: options.info.lastName,
                Mobile: options.info.phone,
                Email: options.info.email
            };

            if (options.address)
            {
                query.Street1 = options.address.street;
                query.Street2 = options.address.unit;
                query.City = options.address.city;
                query.StateID = options.address.state;
                query.Zip = options.address.zip;
            }

            self.Util.fillFieldsIfEmpty(query, [
                'FirstName',
                'LastName',
                'Mobile',
                'Email',
                'CustomerName',
                'DayPhone',
                'NightPhone',
                'Fax',
                'Title',
                'Department',
                'Street1',
                'Street2',
                'Street3',
                'City',
                'StateID',
                'Zip',
                'CountryID',
                'Province'
            ]);

            return self.Customer.client.ManageCustomerAsync(query).then(function (res)
            {
                if (!res || !res.ManageCustomerResult)
                {
                    self.Util.throwInvalidDataError(res);
                }
                if (!res.ManageCustomerResult.CustomerKey)
                {
                    self.Util.throwInvalidDataError(res);
                }

                return {
                    foreignId: res.ManageCustomerResult.CustomerKey
                };
            });
        },

        // https://www.integritypays.com/developers/apis/soap-apis/#managecustomer
        Update: function (options)
        {
            if (!self.Customer.client) return wait(self.Customer.Update, options);

            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.foreignKey, 'options.foreignKey');
            self.Util.validateArgument(options.info, 'options.info');
            self.Util.validateArgument(options.info.id, 'options.info.id');
            self.Util.validateArgument(options.info.businessName, 'options.info.businessName');

            var query = {
                Username: self.CONFIG.username,
                Password: self.CONFIG.password,
                Vendor: self.CONFIG.merchant,

                TransType: 'UPDATE',

                CustomerID: options.info.id,
                CustomerKey: options.foreignKey,
                CustomerName: options.info.businessName,

                FirstName: options.info.firstName,
                LastName: options.info.lastName,
                Mobile: options.info.phone,
                Email: options.info.email
            };

            if (options.address)
            {
                query.Street1 = options.address.street;
                query.Street2 = options.address.unit;
                query.City = options.address.city;
                query.StateID = options.address.state;
                query.Zip = options.address.zip;
            }

            self.Util.fillFieldsIfEmpty(query, [
                'FirstName',
                'LastName',
                'Mobile',
                'Email',
                'CustomerName',
                'DayPhone',
                'NightPhone',
                'Fax',
                'Title',
                'Department',
                'Street1',
                'Street2',
                'Street3',
                'City',
                'StateID',
                'Zip',
                'CountryID',
                'Province'
            ]);

            return self.Customer.client.ManageCustomerAsync(query).then(function (res)
            {
                if (!res || !res.ManageCustomerResult)
                {
                    self.Util.throwInvalidDataError(res);
                }
                if (!res.ManageCustomerResult.CustomerKey)
                {
                    self.Util.throwInvalidDataError(res);
                }

                return {
                    foreignId: res.ManageCustomerResult.CustomerKey
                };
            });
        }
    };

    self.Util = {
        validateArgument: function (arg, name)
        {
            if (arg === null || arg === undefined)
            {
                throw new Error('Required argument missing: ' + name);
            }
        },
        fillFieldsIfEmpty: function (query, fields)
        {
            var setKeys = Object.keys(query);
            fields.forEach(function (f)
            {
                if (!query[f]) query[f] = '';
            });
        },
        throwInvalidDataError: function (res)
        {
            throw new Error('Invalid response data: ' + JSON.stringify(res));
        }
    };

    self.Util.validateArgument(config.merchant, 'merchant');
    self.Util.validateArgument(config.username, 'username');
    self.Util.validateArgument(config.password, 'password');
    self.Util.validateArgument(config.environment, 'environment');

    self.CONFIG = JSON.parse(JSON.stringify(config));

    var baseUrl = sandbox;
    if (self.CONFIG.environment === 'Production') baseUrl = production;
    soap.createClientAsync(baseUrl + 'ws/cardsafe.asmx?wsdl').then(function (client)
    {
        self.Card.client = client;
    });
    soap.createClientAsync(baseUrl + 'vt/ws/recurring.asmx?wsdl').then(function (client)
    {
        self.Customer.client = client;
    });

    /**
     * Private helpers
     */

    function wait(callback, arg)
    {
        return new Promise(function (resolve, reject)
        {
            setTimeout(function ()
            {
                callback(arg).then(resolve).catch(reject);
            }, 200);
        });
    }

    return self;
};

module.exports = integritypays;