module.exports = function(Country) {
  Country.validatesUniquenessOf('iso', 'name', 'niceName', 'iso3',
    'numCode', 'phoneCode');
};
