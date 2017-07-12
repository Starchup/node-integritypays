/**
 * Modules from the community: package.json
 */
var request = require('request-promise');

var production = 'https://gateway.ibxpays.com/';
var sandbox = 'https://sandbox.ibxpays.com/';

/**
 * Constructor
 */
var integritypays = function (config)
{
    var self = this;

    self.Request = {

        CreateRequest: function (endpoint, method, query)
        {
            self.Util.validateArgument(endpoint, 'endpoint');
            self.Util.validateArgument(method, 'method');
            self.Util.validateArgument(query, 'query');

            // Setup base url, default to sandbox and switch to prod when configured
            var baseUrl = sandbox;
            if (self.CONFIG.environment === 'Production') baseUrl = production;

            // Prepare request
            var options = {
                uri: baseUrl + endpoint + '/' + method,
                method: 'POST'
            };

            if (query && this.isObject(query) && Object.keys(query).length > 0)
            {
                var queryArray = Object.keys(query).map(function (key, index)
                {
                    return key + '=' + query[key];
                });
                options.uri = options.uri + '?' + queryArray.join('&');
            }

            return request(options).then(function (res)
            {
                var response = JSON.parse(res);
                if (!response) throw new Error('No response');
                return response;
            });
        }
    };

    self.Card = {
        // https://www.integritypays.com/developers/apis/soap-apis/#storecard
        Create: function (cardNumber, exp, customerId, nameOnCard, street, zipcode)
        {
            self.Util.validateArgument(cardNumber, 'cardNumber');
            self.Util.validateArgument(customerId, 'customerId');
            self.Util.validateArgument(exp, 'exp');

            var query = {
                CardNum: cardNumber,
                CustomerKey: customerId,
                ExpDate: exp,
                NameOnCard: nameOnCard,
                Street: street,
                Zip: zipcode,
                TokenMode: 'DEFAULT'
            };

            return self.Request.CreateRequest('paygate/ws/trxdetail.asmx', 'StoreCard', query);
        },
    };

    self.Util = {
        validateArgument: function (arg, name)
        {
            if (arg === null || arg === undefined)
            {
                throw new Error('Required argument missing: ' + name);
            }
        },

        isObject: function (prop)
        {
            return Object.prototype.toString.call(prop) === '[object Object]';
        },
    };

    self.Util.validateArgument(config.username, 'username');
    self.Util.validateArgument(config.password, 'password');
    self.Util.validateArgument(config.environment, 'environment');

    self.CONFIG = JSON.parse(JSON.stringify(config));

    return self;
};

module.exports = integritypays;
