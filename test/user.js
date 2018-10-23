const chai = require('chai'),
  dictum = require('dictum.js'),
  app = require('./../app'),
  expect = chai.expect,
  User = require('./../app/models').User,
  user = { name: 'name', lastname: 'lastname', email: 'test@wolox.co', password: '12345678' },
  cookie = require('cookie'),
  createUser = _ =>
    chai
      .request(app)
      .post('/users/')
      .send(user);

const loginUser = usr => {
  return chai
    .request(app)
    .post('/users/sessions')
    .send(usr);
};

const getToken = res => {
  const cookies = res.headers['set-cookie'];
  let token;
  if (cookies) {
    cookies.forEach(icookie => {
      token = cookie.parse(icookie)['x-access-token'];
    });
  }
  return token;
};

describe('/users POST', () => {
  it('expect to create a valid user and return 201', done => {
    chai
      .request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        User.count().then(count => {
          expect(count).to.equal(1);
        });
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.user).to.have.property('name', 'name');
        expect(res.body.user).to.have.property('lastname', 'lastname');
        expect(res.body.user).to.have.property('id');
        dictum.chai(res, 'Create user');
        done();
      });
  });
  it('expect to send error message of password character lenghth and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'name', lastname: 'lastname', email: 'test2@wolox.co', password: '1' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res).to.be.a('object');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('value', '1');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'password');
        expect(res.body.message[0]).to.have.property('msg', 'Password should be 8 characters minimum');
        done();
      });
  });
  it('expect to send error message of invalid characters for password and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'name', lastname: 'lastname', email: 'test2@wolox.co', password: '!!!!!!!!' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('value', '!!!!!!!!');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'password');
        expect(res.body.message[0]).to.have.property('msg', 'Password should be alphanumeric only');
        done();
      });
  });
  it('expect to fail, email already in use for another user', done => {
    createUser().then(() => {
      chai
        .request(app)
        .post('/users/')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message', 'email must be unique');
          expect(res.body).to.have.property('internal_code', 'database_error');
          done();
        });
    });
  });
  it('expect to send error message "lastname is required" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'name', email: 'test@wolox.co', password: '12345678' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'lastname');
        expect(res.body.message[0]).to.have.property('msg', 'Lastname is required');
        done();
      });
  });
  it('expect to send error message "e-mail is required" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'name', lastname: 'lastname', password: '12345678' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'email');
        expect(res.body.message[0]).to.have.property('msg', 'E-mail is required');
        done();
      });
  });
  it('expect to send error message "name is required" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ lastname: 'lastname', email: 'test@wolox.co', password: '12345678' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'name');
        expect(res.body.message[0]).to.have.property('msg', 'Name is required');
        done();
      });
  });
  it('expect to send error message "email must be from wolox domain" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: user.name, lastname: user.lastname, email: 'test@hotmail.com', password: user.password })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'email');
        expect(res.body.message[0]).to.have.property('msg', 'E-mail must be from wolox domain');
        done();
      });
  });
  it('expect to send error message "password is required" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: user.name, lastname: user.lastname, email: user.email })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'password');
        expect(res.body.message[0]).to.have.property('msg', 'Password is required');
        done();
      });
  });
});

describe('/users/sessions POST', () => {
  it('expect to login a user and return 200', done => {
    User.create(user).then(() => {
      chai
        .request(app)
        .post('/users/sessions')
        .send({ email: user.email, password: user.password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('auth', true);
          expect(res).to.have.cookie('x-access-token');
          dictum.chai(res, 'Login user');
          done();
        });
    });
  });
  it('expect to send error message invalid credentials a user and return 401', done => {
    User.create(user).then(() => {
      chai
        .request(app)
        .post('/users/sessions')
        .send({ email: user.email, password: 'invalid' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('internal_code', 'unauthorized');
          done();
        });
    });
  });
  it('expect to send error message "e-mail is required" and return 400', done => {
    chai
      .request(app)
      .post('/users/sessions')
      .send({ password: user.password })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'email');
        expect(res.body.message[0]).to.have.property('msg', 'E-mail is required');
        done();
      });
  });
  it('expect to send error message "email must be from wolox domain" and return 400', done => {
    chai
      .request(app)
      .post('/users/sessions')
      .send({ email: 'test@hotmail.com', password: '12345678' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'email');
        expect(res.body.message[0]).to.have.property('msg', 'E-mail must be from wolox domain');
        done();
      });
  });
  it('expect to send error message "password is required" and return 400', done => {
    chai
      .request(app)
      .post('/users/sessions')
      .send({ email: user.email })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'password');
        expect(res.body.message[0]).to.have.property('msg', 'Password is required');
        done();
      });
  });
});

describe('/users/page=1 GET', () => {
  it('expect to get a list of users return 200', done => {
    createUser().then(() => {
      loginUser(user).then(res => {
        chai
          .request(app)
          .get('/users?page=1')
          .set('x-access-token', getToken(res))
          .end((err, response) => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('users');
            expect(response.body.users).to.be.an('array');
            expect(response.body.users.length).to.equal(1);
            expect(response.body).to.have.property('count', 1);
            expect(response.body).to.have.property('pages', 1);
            dictum.chai(res, 'Get all users');
            done();
          });
      });
    });
  });
  it('expect to get a empty list of users return 200', done => {
    createUser().then(() => {
      loginUser(user).then(res => {
        chai
          .request(app)
          .get('/users?page=100')
          .set('x-access-token', getToken(res))
          .end((err, response) => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('users');
            expect(response.body.users).to.be.an('array');
            expect(response.body.users.length).to.equal(0);
            expect(response.body).to.have.property('count', 1);
            expect(response.body).to.have.property('pages', 1);
            done();
          });
      });
    });
  });
  it('expect to return the first page, no matter the page param, and return 200', done => {
    createUser().then(() => {
      loginUser(user).then(res => {
        chai
          .request(app)
          .get('/users')
          .set('x-access-token', getToken(res))
          .end((err, response) => {
            expect(response).to.have.status(200);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('users');
            expect(response.body.users).to.be.an('array');
            expect(response.body).to.have.property('count', 1);
            expect(response.body).to.have.property('pages', 1);
            done();
          });
      });
    });
  });
  it('expect to get a message error because the offset is negative and return 500', done => {
    createUser().then(() => {
      loginUser(user).then(res => {
        chai
          .request(app)
          .get('/users?page=-5')
          .set('x-access-token', getToken(res))
          .end((err, response) => {
            expect(response).to.have.status(500);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('message', 'Error in query to find all users');
            expect(response.body).to.have.property('internal_code', 'database_error');
            done();
          });
      });
    });
  });
  it('expect to get a message error because invalid token and return 401', done => {
    createUser().then(() => {
      loginUser(user).then(res => {
        chai
          .request(app)
          .get('/users?page=1')
          .set('x-access-token', 'invalid token')
          .end((err, response) => {
            expect(response).to.have.status(401);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('message', 'Unauthorized access');
            expect(response.body).to.have.property('internal_code', 'unauthorized');
            done();
          });
      });
    });
  });
  it('expect to get a message error because no token provided and return 400', done => {
    createUser().then(() => {
      loginUser(user).then(res => {
        chai
          .request(app)
          .get('/users?page=1')
          .end((err, response) => {
            expect(response).to.have.status(400);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('message', 'No token provided');
            expect(response.body).to.have.property('internal_code', 'bad_request');
            done();
          });
      });
    });
  });
});
describe('/users/admin POST', () => {
  it('expect to create a new admin user and return 201', done => {
    User.create({
      name: 'name',
      lastname: 'lastname',
      email: 'test@wolox.co',
      password: '12345678',
      isAdmin: true
    }).then(usr => {
      loginUser({ email: usr.email, password: '12345678' }).then(res => {
        chai
          .request(app)
          .post('/users/admin')
          .send(user)
          .set('x-access-token', getToken(res))
          .end((err, response) => {
            expect(response).to.have.status(201);
            expect(response.body).to.be.an('object');
            expect(response.body.user).to.have.property('name', 'name');
            expect(response.body.user).to.have.property('lastname', 'lastname');
            expect(response.body.user).to.have.property('id');
            expect(response.body.user).to.have.property('isAdmin', true);
            dictum.chai(response, 'Create user');
            done();
          });
      });
    });
  });
  it('expect to send an error message because a regular-user try to create a admin-user and return 401', done => {
    createUser().then(() => {
      loginUser(user).then(res => {
        chai
          .request(app)
          .post('/users/admin')
          .send(user)
          .set('x-access-token', getToken(res))
          .end((err, response) => {
            expect(response).to.have.status(401);
            expect(response.body).to.be.an('object');
            expect(response.body).to.have.property('message');
            expect(response.body).to.have.property('internal_code', 'unauthorized');
            done();
          });
      });
    });
  });
});
