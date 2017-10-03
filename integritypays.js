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
            if (!self.Customer.client)
            {
                return wait(self.Card.Create, options);
            }

            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.foreignKey, 'options.foreignKey');
            self.Util.validateArgument(options.cardNumber, 'options.cardNumber');
            self.Util.validateArgument(options.exp, 'options.exp');

            var query = {
                Username: self.CONFIG.username,
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

            return self.Card.client.StoreCardAsync(query);
        },
    };

    self.Customer = {
        // https://www.integritypays.com/developers/apis/soap-apis/#managecustomer
        Create: function (options)
        {
            if (!self.Customer.client)
            {
                return wait(self.Customer.Create, options);
            }

            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.info, 'options.info');
            self.Util.validateArgument(options.info.id, 'options.info.id');
            self.Util.validateArgument(options.info.businessName, 'options.info.businessName');
            self.Util.validateArgument(options.info.firstName, 'options.info.firstName');
            self.Util.validateArgument(options.info.lastName, 'options.info.lastName');
            self.Util.validateArgument(options.info.phone, 'options.info.phone');
            self.Util.validateArgument(options.info.email, 'options.info.email');
            self.Util.validateArgument(options.address, 'options.address');
            self.Util.validateArgument(options.address.street, 'options.address.street');
            self.Util.validateArgument(options.address.city, 'options.address.city');
            self.Util.validateArgument(options.address.state, 'options.address.state');
            self.Util.validateArgument(options.address.zip, 'options.address.zip');

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
                Email: options.info.email,

                Street1: options.address.street,
                Street2: options.address.unit,
                City: options.address.city,
                StateID: options.address.state,
                Zip: options.address.zip
            };

            // Fill in any remaining empty fields
            self.Util.fillFieldsIfEmpty(query, [
                'CustomerName',
                'DayPhone',
                'NightPhone',
                'Fax',
                'Title',
                'Department',
                'Street2',
                'Street3',
                'CountryID',
                'Province'
            ]);

            return self.Customer.client.ManageCustomerAsync(query);
        },

        // https://www.integritypays.com/developers/apis/soap-apis/#managecustomer
        Update: function (options)
        {
            if (!self.Customer.client)
            {
                return wait(self.Customer.Update, options);
            }

            self.Util.validateArgument(options, 'options');
            self.Util.validateArgument(options.foreignKey, 'options.foreignKey');
            self.Util.validateArgument(options.info, 'options.info');
            self.Util.validateArgument(options.info.id, 'options.info.id');
            self.Util.validateArgument(options.info.businessName, 'options.info.businessName');
            self.Util.validateArgument(options.info.firstName, 'options.info.firstName');
            self.Util.validateArgument(options.info.lastName, 'options.info.lastName');
            self.Util.validateArgument(options.info.phone, 'options.info.phone');
            self.Util.validateArgument(options.info.email, 'options.info.email');
            self.Util.validateArgument(options.address, 'options.address');
            self.Util.validateArgument(options.address.street, 'options.address.street');
            self.Util.validateArgument(options.address.city, 'options.address.city');
            self.Util.validateArgument(options.address.state, 'options.address.state');
            self.Util.validateArgument(options.address.zip, 'options.address.zip');

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
                Email: options.info.email,

                Street1: options.address.street,
                Street2: options.address.unit,
                City: options.address.city,
                StateID: options.address.state,
                Zip: options.address.zip
            };

            self.Util.fillFieldsIfEmpty(query, [
                'CustomerName',
                'DayPhone',
                'NightPhone',
                'Fax',
                'Title',
                'Department',
                'Street2',
                'Street3',
                'CountryID',
                'Province'
            ]);

            return self.Customer.client.ManageCustomerAsync(query);
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
        }
    };

    self.Util.validateArgument(config.merchant, 'merchant');
    self.Util.validateArgument(config.username, 'username');
    self.Util.validateArgument(config.password, 'password');
    self.Util.validateArgument(config.environment, 'environment');

    self.CONFIG = JSON.parse(JSON.stringify(config));

    var baseUrl = sandbox;
    if (self.CONFIG.environment === 'Production') baseUrl = production;
    soap.createClientAsync(baseUrl + 'ws/cardsafe.asmx?wsdl').then((client) =>
    {
        self.Card.client = client;
    });
    soap.createClientAsync(baseUrl + 'vt/ws/recurring.asmx?wsdl').then((client) =>
    {
        self.Customer.client = client;
    });

    /**
     * Private helpers
     */

    function wait(callback, arg)
    {
        return new Promise((resolve, reject) =>
        {
            setTimeout(() =>
            {
                callback(arg).then(resolve).catch(reject);
            }, 300);
        });
    }

    return self;
};

module.exports = integritypays;