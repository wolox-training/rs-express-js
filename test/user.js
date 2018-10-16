const chai = require('chai'),
  dictum = require('dictum.js'),
  app = require('./../app'),
  should = chai.should(),
  expect = chai.expect,
  User = require('./../app/models').User,
  user = { name: 'name', lastname: 'lastname', email: 'test@wolox.co', password: '12345678' };

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
  it('should send error message of email already in use and return 400', async () => {
    await User.create(user).then(() => {
      chai
        .request(app)
        .post('/users')
        .send(user)
        .end(function(err, res) {
          expect(res).to.have.status(400);
          res.should.be.json;
          res.body.should.be.a('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('internal_code', 'bad_request');
          expect(res.body.message[0]).to.have.property('value', 'test@wolox.co');
          expect(res.body.message[0]).to.have.property('location', 'body');
          expect(res.body.message[0]).to.have.property('param', 'email');
          expect(res.body.message[0]).to.have.property('msg', 'E-mail already in use');
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
});
