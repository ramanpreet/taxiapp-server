module.exports = function(Booking) {
  Booking.validateAsync('status', myCustom, { message: 'Dont like' });

  function myCustom(err, done) {
    console.log(this.startAt);
    var status = this.status;
    if (status === 0) {
      //err();
    }
    done();
  }

  Booking.observe('before save', function updateTimestamp(ctx, next) {
    if (ctx.instance) {
      ctx.instance.modified = new Date();
      var booking = ctx.instance;
      if (booking.status == 1 && ctx.isNewInstance) {
        var minDate = new Date();
        minDate.setMinutes(minDate.getMinutes() + 25);
        var maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);
        if (booking.startAt < minDate ||
          booking.startAt > maxDate) {
          var err = new Error('Booking Date Validation error');
          err.status = 403; // HTTP status code
          next(err);
        }
      }
    } else {
      ctx.data.modified = new Date();
    }
    next();
  });

  Booking.observe('after save', function updateTimestamp(ctx, next) {
    if (ctx.instance) {
      ctx.instance.vehicle(function(err, vehicle) {
        if (err) throw err;
        ctx.instance.customer(function(err, customer) {
          if (err) throw err;
          var status = ctx.instance.status;
          if (status == 0) {
            newBooking(ctx.instance, customer, vehicle);
          } else if (status == 2) {
            bookingConfirmed(ctx.instance, customer, vehicle);
          } else if (status == 3) {
            bookingCancelled(ctx.instance, customer, vehicle);
          }
        });
      });
    } else {
      ctx.data.vehicle(function(err, vehicle) {
        if (err) throw err;
        ctx.data.customer(function(err, customer) {
          if (err) throw err;
          if (ctx.data.status == 2) {
            bookingConfirmed(customer, vehicle);
          } else {
            bookingCancelled(customer, vehicle);
          }
        });
      });
    }
    next();
  });

  function newBooking(booking, customer, vehicle) {
    var msg = '<p>Hi,<br>'
    msg += 'Taxi booked by ' +
      customer.firstName + ' ' + customer.email + '.</p>';

    sendEmail({
      to: customer.email,
      from: 'mparvesh@gmail.com',
      subject: 'New Booking ' + booking.id,
      html: msg
    });
  }

  function bookingConfirmed(booking, customer, vehicle) {
    var msg = '<p>Hi ' + customer.firstName + ',<br>'
    msg += 'Driver is on the way to your location in ' +
      vehicle.color + ' ' + vehicle.model + ' ' +
      vehicle.registrationNo + '.</p>';

    sendEmail({
      to: customer.email,
      from: 'mparvesh@gmail.com',
      subject: 'Booking Confirmed!',
      html: msg
    });
  }

  function bookingCancelled(booking, customer, vehicle) {
    var msg = '<p>Hi,<br>'
    msg += 'Booking has been cancelled by ' +
      customer.firstName + ' ' + customer.email + '.</p>';

    sendEmail({
      to: customer.email,
      from: 'mparvesh@gmail.com',
      subject: 'Booking Cancelled ' + booking.id,
      html: msg
    });
  }

  function sendEmail(options) {
    Booking.app.models.Email.send(options, function(err) {
      if (err) throw err;
      console.log("sent");
    });
  }
};
