// const chai = require('chai'),
//   dictum = require('dictum.js'),
//   app = require('./../app'),
//   should = chai.should(),
//   expect = chai.expect,
//   User = require('./../app/models').User,
//   user = { name: 'name', lastname: 'lastname', email: 'test@wolox.co', password: '12345678' };
//
// describe('/users POST', () => {
//   it('should create a valid user and return 201', done => {
//     chai
//       .request(app)
//       .post('/users')
//       .send(user)
//       .end(function(err, res) {
//         expect(res).to.have.status(201);
//         res.should.be.json;
//         res.body.should.be.a('object');
//         res.body.user.should.have.property('name');
//         res.body.user.should.have.property('lastname');
//         res.body.user.should.have.property('id');
//         res.body.user.name.should.equal('name');
//         res.body.user.lastname.should.equal('lastname');
//         dictum.chai(res, 'Create user');
//         done();
//       });
//   });
//   it('should send error message of password character lenghth and return 400', done => {
//     chai
//       .request(app)
//       .post('/users')
//       .send({ name: 'name', lastname: 'lastname', email: 'test2@wolox.co', password: '1' })
//       .end(function(err, res) {
//         expect(res).to.have.status(400);
//         res.should.be.json;
//         res.body.should.be.a('Array');
//         expect(res.body[0]).to.have.property('location');
//         expect(res.body[0]).to.have.property('param');
//         expect(res.body[0]).to.have.property('value');
//         expect(res.body[0]).to.have.property('msg');
//         res.body[0].location.should.equal('body');
//         res.body[0].param.should.equal('password');
//         res.body[0].value.should.equal('1');
//         res.body[0].msg.should.equal('Password should be 8 characters minimum');
//         done();
//       });
//   });
//   it('should send error message of invalid characters for password and return 400', done => {
//     chai
//       .request(app)
//       .post('/users')
//       .send({ name: 'name', lastname: 'lastname', email: 'test2@wolox.co', password: '!!!!!!!!' })
//       .end(function(err, res) {
//         expect(res).to.have.status(400);
//         res.should.be.json;
//         res.body.should.be.a('Array');
//         expect(res.body[0]).to.have.property('location');
//         expect(res.body[0]).to.have.property('param');
//         expect(res.body[0]).to.have.property('value');
//         expect(res.body[0]).to.have.property('msg');
//         res.body[0].location.should.equal('body');
//         res.body[0].param.should.equal('password');
//         res.body[0].value.should.equal('!!!!!!!!');
//         res.body[0].msg.should.equal('Password should be alphanumeric only');
//         done();
//       });
//   });
//   it('should send error message of email already in use and return 400', done => {
//     User.create(user);
//     chai
//       .request(app)
//       .post('/users')
//       .send(user)
//       .end(function(err, res) {
//         expect(res).to.have.status(400);
//         res.should.be.json;
//         res.body.should.be.a('Array');
//         expect(res.body[0]).to.have.property('location');
//         expect(res.body[0]).to.have.property('param');
//         expect(res.body[0]).to.have.property('value');
//         expect(res.body[0]).to.have.property('msg');
//         res.body[0].location.should.equal('body');
//         res.body[0].param.should.equal('email');
//         res.body[0].value.should.equal('test@wolox.co');
//         res.body[0].msg.should.equal('E-mail already in use');
//         done();
//       });
//   });
//   it('should send error message "lastname is required" and return 400', done => {
//     chai
//       .request(app)
//       .post('/users')
//       .send({ name: 'name', email: 'test@wolox.co', password: '12345678' })
//       .end(function(err, res) {
//         expect(res).to.have.status(400);
//         res.should.be.json;
//         res.body.should.be.a('Array');
//         expect(res.body[0]).to.have.property('location');
//         expect(res.body[0]).to.have.property('param');
//         expect(res.body[0]).to.have.property('msg');
//         res.body[0].location.should.equal('body');
//         res.body[0].param.should.equal('lastname');
//         res.body[0].msg.should.equal('Lastname is required');
//         done();
//       });
//   });
//   it('should send error message "e-mail is required" and return 400', done => {
//     chai
//       .request(app)
//       .post('/users')
//       .send({ name: 'name', lastname: 'lastname', password: '12345678' })
//       .end(function(err, res) {
//         expect(res).to.have.status(400);
//         res.should.be.json;
//         res.body.should.be.a('Array');
//         expect(res.body[0]).to.have.property('location');
//         expect(res.body[0]).to.have.property('param');
//         expect(res.body[0]).to.have.property('msg');
//         res.body[0].location.should.equal('body');
//         res.body[0].param.should.equal('email');
//         res.body[0].msg.should.equal('E-mail is required');
//         done();
//       });
//   });
//   it('should send error message "name is required" and return 400', done => {
//     chai
//       .request(app)
//       .post('/users')
//       .send({ lastname: 'lastname', email: 'test@wolox.co', password: '12345678' })
//       .end(function(err, res) {
//         expect(res).to.have.status(400);
//         res.should.be.json;
//         res.body.should.be.a('Array');
//         expect(res.body[0]).to.have.property('location');
//         expect(res.body[0]).to.have.property('param');
//         expect(res.body[0]).to.have.property('msg');
//         res.body[0].location.should.equal('body');
//         res.body[0].param.should.equal('name');
//         res.body[0].msg.should.equal('Name is required');
//         done();
//       });
//   });
// });
