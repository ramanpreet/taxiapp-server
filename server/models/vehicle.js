module.exports = function(Vehicle) {
  Vehicle.validatesUniquenessOf('registrationNo');

  Vehicle.observe('before save', function updateTimestamp(ctx, next) {
    if (ctx.instance) {
      ctx.instance.modified = new Date();
    } else {
      ctx.data.modified = new Date();
    }
    next();
  });
};
