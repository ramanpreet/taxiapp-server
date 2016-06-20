module.exports = function(app) {
  var loopback = require('loopback');
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var VehicleType = app.models.VehicleType;
  var Message = app.models.Message;
  var Vehicle = app.models.Vehicle;
  var Favourite = app.models.Favourite;
  var Company = app.models.Company;
  var Booking = app.models.Booking;
  var Country = app.models.Country;
  var countryId;

  Country.findOne({ where: { iso: 'UA' } }, function(err, country) {
    countryId = country.id;
    init();
  });

  function init() {
    //createUser();
    findUser();
  }

  function createUser() {
    User.create([{
      email: 'mparvesh@gmail.com',
      password: 'open',
      title: 'Mr',
      gender: 'Male',
      firstName: 'Parvesh',
      lastName: 'Garg',
      address: 'Sector 47',
      zipCode: 151509,
      city: 'Noida',
      state: 'UP',
      countryId: countryId,
      mobileNumber: 9560158603,
      avatar: 'abcd.png',
      birthdate: new Date('1985-08-20')
    }], function(err, users) {
      if (err) throw err;

      console.log('Created users:', users);

      // create the admin role
      /*Role.create({
        name: 'admin'
      }, function(err, role) {
        if (err) throw err;

        console.log('Created role:', role);

        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, function(err, principal) {
          if (err) throw err;

          console.log('Created principal:', principal);
        });

        role.users(function(err, users) {
          console.log(users);
        });
      });*/
    });
  }

  function findUser() {
    User.findOne({
      where: { email: 'mparvesh@gmail.com' }
    }, function(err, user) {
      if (err) throw err;
      //console.log(user);

      Role.isInRole('driver', { principalType: RoleMapping.USER, principalId: user.id }, function(err, roles) {
        if (err) throw err;
        console.log(roles);

        createBooking(user.id);
        //findBooking();
        //updateBooking();
      });

      /*Role.getRoles({ principalType: RoleMapping.USER, principalId: user.id }, function(err, roles) {
        if (err) throw err;
        //console.log(roles);
        Role.findById(roles[2], function(err, role) {
          if (err) throw err;
          console.log(role.name);
        })
      });*/

      /*Role.findOne({
        where: { name: 'admin' }
      }, function(err, role) {
        if (err) throw err;
        console.log(role);

        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: user.id
        }, function(err, principal) {
          if (err) throw err;

          console.log('Created principal:', principal);
        });

        role.users(function(err, users) {
          console.log(users);
        });
      });*/

    });
  }

  /*Role.create([
      { name: 'admin' },
      { name: 'manager' },
      { name: 'driver' },
      { name: 'customer' }
    ],
    function(err, roles) {
      if (err) throw err;
    });*/


  /*Role.findOne({
    where: { name: 'admin' }
  }, function(err, role) {
    if (err) throw err;
    console.log(role);

    role.users(function(err, users) {
      console.log(users);
    });
  });*/

  function createBooking(userId) {
    var startAt = new Date();
    //startAt.setMinutes(startAt.getMinutes() + 30)
    Booking.create([{
      sourceLocation: { lat: 10.32424, lng: 5.84978 },
      destLocation: { lat: 15.32424, lng: 15.84978 },
      sourceAddress: "Source",
      destAddress: "Destination",
      duration: 50,
      distance: 20,
      startAt: startAt,
      endAt: null,
      seatsNum: 5,
      fare: 200,
      cancelReason: "Driver late",
      notes: 'notes notes',
      status: 0,
      customerId: userId,
      vehicleId: '5766a63a6f0131181b8a5dae'
    }], function(err, bookings) {
      if (err) throw err;

      console.log('Created bookings:', bookings);
    });
  }

  function updateBooking() {
    Booking.find({ include: ['customer', 'vehicle'] }, function(err, bookings) {
      if (err) throw err;

      bookings[0].status = 3;
      bookings[0].save(function(err, booking) {
        if (err) throw err;
        console.log(booking);
      })
      console.log('Created bookings:', bookings);

      bookings[0].customer(function(err, customer) {
        if (err) throw err;
        //console.log(customer.firstName);
      });

      /*bookings[0].vehicle(function(err, vehicle) {
        if (err) throw err;
        console.log(vehicle.companyId);
      });*/
    });
  }

  function findBooking() {
    Booking.find({ include: ['customer', 'vehicle'] }, function(err, bookings) {
      if (err) throw err;

      console.log('Created bookings:', bookings);

      bookings[0].customer(function(err, customer) {
        if (err) throw err;
        console.log(customer.firstName);
      });

      /*bookings[0].vehicle(function(err, vehicle) {
        if (err) throw err;
        console.log(vehicle.companyId);
      });*/
    });
  }

  /*Company.create([{
    name: 'TaxiCompany',
    logo: 'taxiLogo.png',
    address: 'Ukraine',
    mobileNumber: 9560158604,
    phoneNumber: 442791352,
    fax: 442791353,
    description: 'Taxi'
  }], function(err, companies) {
    if (err) throw err;

    console.log('Created companies: ', companies);
  });*/

  /*var here = new loopback.GeoPoint({ lat: 10.32424, lng: 5.84978 });

  Favourite.create([
    { name: 'HOME', location: here, address: "Sector 47, Noida" }
  ], function(err, favourites) {
    if (err) throw err;

    console.log('Created favourites: ', favourites);
  });*/

  /*Message.create([
    {content: 'Hello World', messageFrom: 'Stephane', sentAt: new Date()}
  ], function(err, messages) {
    if (err) throw err;

    console.log('Created messages: ', messages);
  });*/

  /*Country.create([{
    iso: 'UA',
    name: 'UKRAINE',
    niceName: 'Ukraine',
    iso3: 'UKR',
    numCode: 804,
    phoneCode: 380,
    currencyCode: 'UAH',
    currencySymbol: '₴'
  }], function(err, countries) {
    if (err) throw err;

    console.log('Created countries: ', countries);
  });*/

  /*VehicleType.create([
    { id: 'PREMIUM', farePerKm: 10 },
    { id: 'VAN', farePerKm: 15 }
  ], function(err, vehicleTypes) {
    if (err) throw err;

    console.log('Created vehicleTypes: ', vehicleTypes);
  });*/

  Company.findOne({ where: { name: 'TaxiCompany' } }, function(err, company) {
    if (err) throw err;
    //createVehicle(company.id);
  });

  function createVehicle(companyId) {
    VehicleType.findById('VAN', { include: 'vehicles' },
      function(err, vehicleType) {
        if (err) throw err;

        console.log('Created vehicleType: ', vehicleType);

        vehicleType.vehicles({ include: ['country', 'company'] }, function(err, vehicles) {
          console.log(vehicles[0]);
        });
      });
  }
};


/*Country.findOne({ where: { iso: 'UA' } }, function(err, country) {
  Vehicle.create([{
    registrationNo: 'UP16 P59300',
    seatingCapacity: 4,
    color: 'White',
    maker: 'Nissan',
    model: 'Titan',
    typeId: vehicleType.id,
    countryId: country.id,
    companyId: companyId,
  }], function(err, vehicles) {
    if (err) throw err;

    console.log('Created vehicles: ', vehicles);
  });
});*/
