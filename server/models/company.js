module.exports = function(Company) {
  Company.validatesUniquenessOf('name');

  Company.observe('before save', function updateTimestamp(ctx, next) {
    if (ctx.instance) {
      ctx.instance.modified = new Date();
    } else {
      ctx.data.modified = new Date();
    }
    next();
  });
};
