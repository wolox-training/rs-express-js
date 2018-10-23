const chai = require('chai'),
  dictum = require('dictum.js'),
  app = require('./../app'),
  should = chai.should(),
  expect = chai.expect,
  User = require('./../app/models').User,
  user = { name: 'name', lastname: 'lastname', email: 'test@wolox.co', password: '12345678' },
  cookie = require('cookie'),
  createUser = () =>
    chai
      .request(app)
      .post('/users/')
      .send(user);

const loginUser = () =>
  chai
    .request(app)
    .post('/users/sessions')
    .send({ email: user.email, password: user.password });

const getToken = res => {
  const cookies = res.headers['set-cookie'];
  let token;
  if (cookies) {
    cookies.forEach(function(icookie) {
      token = cookie.parse(icookie)['x-access-token'];
    });
  }
  return token;
};

describe('/users POST', () => {
  it('should create a valid user and return 201', done => {
    chai
      .request(app)
      .post('/users')
      .send(user)
      .end(function(err, res) {
        User.count().then(count => {
          count.should.equal(1);
        });
        expect(res).to.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.user.should.have.property('name');
        res.body.user.should.have.property('lastname');
        res.body.user.should.have.property('id');
        res.body.user.name.should.equal('name');
        res.body.user.lastname.should.equal('lastname');
        dictum.chai(res, 'Create user');
        done();
      });
  });
  it('should send error message of password character lenghth and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'name', lastname: 'lastname', email: 'test2@wolox.co', password: '1' })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('value', '1');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'password');
        expect(res.body.message[0]).to.have.property('msg', 'Password should be 8 characters minimum');
        done();
      });
  });
  it('should send error message of invalid characters for password and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'name', lastname: 'lastname', email: 'test2@wolox.co', password: '!!!!!!!!' })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('value', '!!!!!!!!');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'password');
        expect(res.body.message[0]).to.have.property('msg', 'Password should be alphanumeric only');
        done();
      });
  });
  it('should fail, email already in use for another user', done => {
    createUser().then(() => {
      chai
        .request(app)
        .post('/users/')
        .send(user)
        .end(function(err, res) {
          expect(res).to.have.status(500);
          res.should.be.json;
          res.body.should.be.a('object');
          expect(res.body).to.have.property('message', 'email must be unique');
          expect(res.body).to.have.property('internal_code', 'database_error');
          done();
        });
    });
  });
  it('should send error message "lastname is required" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'name', email: 'test@wolox.co', password: '12345678' })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'lastname');
        expect(res.body.message[0]).to.have.property('msg', 'Lastname is required');
        done();
      });
  });
  it('should send error message "e-mail is required" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'name', lastname: 'lastname', password: '12345678' })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'email');
        expect(res.body.message[0]).to.have.property('msg', 'E-mail is required');
        done();
      });
  });
  it('should send error message "name is required" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ lastname: 'lastname', email: 'test@wolox.co', password: '12345678' })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'name');
        expect(res.body.message[0]).to.have.property('msg', 'Name is required');
        done();
      });
  });
  it('should send error message "email must be from wolox domain" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: user.name, lastname: user.lastname, email: 'test@hotmail.com', password: user.password })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'email');
        expect(res.body.message[0]).to.have.property('msg', 'E-mail must be from wolox domain');
        done();
      });
  });
  it('should send error message "password is required" and return 400', done => {
    chai
      .request(app)
      .post('/users')
      .send({ name: user.name, lastname: user.lastname, email: user.email })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
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
  it('should login a user and return 200', done => {
    User.create(user).then(() => {
      chai
        .request(app)
        .post('/users/sessions')
        .send({ email: user.email, password: user.password })
        .end(function(err, res) {
          expect(res).to.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          expect(res.body).to.have.property('auth', true);
          expect(res).to.have.cookie('x-access-token');
          dictum.chai(res, 'Login user');
          done();
        });
    });
  });
  it('should send error message invalid credentials a user and return 401', done => {
    User.create(user).then(() => {
      chai
        .request(app)
        .post('/users/sessions')
        .send({ email: user.email, password: 'invalid' })
        .end(function(err, res) {
          expect(res).to.have.status(401);
          res.should.be.json;
          res.body.should.be.a('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('internal_code', 'unauthorized');
          done();
        });
    });
  });
  it('should send error message "e-mail is required" and return 400', done => {
    chai
      .request(app)
      .post('/users/sessions')
      .send({ password: user.password })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'email');
        expect(res.body.message[0]).to.have.property('msg', 'E-mail is required');
        done();
      });
  });
  it('should send error message "email must be from wolox domain" and return 400', done => {
    chai
      .request(app)
      .post('/users/sessions')
      .send({ email: 'test@hotmail.com', password: '12345678' })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('internal_code', 'bad_request');
        expect(res.body.message[0]).to.have.property('location', 'body');
        expect(res.body.message[0]).to.have.property('param', 'email');
        expect(res.body.message[0]).to.have.property('msg', 'E-mail must be from wolox domain');
        done();
      });
  });
  it('should send error message "password is required" and return 400', done => {
    chai
      .request(app)
      .post('/users/sessions')
      .send({ email: user.email })
      .end(function(err, res) {
        expect(res).to.have.status(400);
        res.should.be.json;
        res.body.should.be.a('object');
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
  it('should get a list of users return 200', done => {
    createUser().then(() => {
      loginUser().then(res => {
        chai
          .request(app)
          .get('/users?page=1')
          .set('x-access-token', getToken(res))
          .end(function(err, response) {
            expect(response).to.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            expect(response.body).to.have.property('users');
            response.body.users.should.be.a('array');
            expect(response.body.users.length).to.equal(1);
            expect(response.body).to.have.property('count', 1);
            expect(response.body).to.have.property('pages', 1);
            dictum.chai(res, 'Get all users');
            done();
          });
      });
    });
  });
  it('should get a empty list of users return 200', done => {
    createUser().then(() => {
      loginUser().then(res => {
        chai
          .request(app)
          .get('/users?page=100')
          .set('x-access-token', getToken(res))
          .end(function(err, response) {
            expect(response).to.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            expect(response.body).to.have.property('users');
            response.body.users.should.be.a('array');
            expect(response.body.users.length).to.equal(0);
            expect(response.body).to.have.property('count', 1);
            expect(response.body).to.have.property('pages', 1);
            done();
          });
      });
    });
  });
  it('should return the first page, no matter the page param, and return 200', done => {
    createUser().then(() => {
      loginUser().then(res => {
        chai
          .request(app)
          .get('/users')
          .set('x-access-token', getToken(res))
          .end(function(err, response) {
            expect(response).to.have.status(200);
            response.should.be.json;
            response.body.should.be.a('object');
            expect(response.body).to.have.property('users');
            response.body.users.should.be.a('array');
            expect(response.body).to.have.property('count', 1);
            expect(response.body).to.have.property('pages', 1);
            done();
          });
      });
    });
  });
  it('should get a message error because the offset is negative and return 500', done => {
    createUser().then(() => {
      loginUser().then(res => {
        chai
          .request(app)
          .get('/users?page=-5')
          .set('x-access-token', getToken(res))
          .end(function(err, response) {
            expect(response).to.have.status(500);
            response.should.be.json;
            response.body.should.be.a('object');
            expect(response.body).to.have.property('message', 'Error in query to find all users');
            expect(response.body).to.have.property('internal_code', 'database_error');
            done();
          });
      });
    });
  });
  it('should get a message error because invalid token and return 401', done => {
    createUser().then(() => {
      loginUser().then(res => {
        chai
          .request(app)
          .get('/users?page=1')
          .set('x-access-token', 'invalid token')
          .end(function(err, response) {
            expect(response).to.have.status(401);
            response.should.be.json;
            response.body.should.be.a('object');
            expect(response.body).to.have.property('message', 'Unauthorized access');
            expect(response.body).to.have.property('internal_code', 'unauthorized');
            done();
          });
      });
    });
  });
  it('should get a message error because no token provided and return 400', done => {
    createUser().then(() => {
      loginUser().then(res => {
        chai
          .request(app)
          .get('/users?page=1')
          .end(function(err, response) {
            expect(response).to.have.status(400);
            response.should.be.json;
            response.body.should.be.a('object');
            expect(response.body).to.have.property('message', 'No token provided');
            expect(response.body).to.have.property('internal_code', 'bad_request');
            done();
          });
      });
    });
  });
});
