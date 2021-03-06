const chai = require('chai')
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server')

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.have.a.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        expect(res.body.length).to.be.at.least(1);

        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate']
        res.body.forEach(function(post) {
          expect(post).to.be.a('object');
          expect(post).to.include.keys(expectedKeys)
        });
      });
  });

  it('should add a blog post on POST', function() {
    const newPost = {
      title: 'Rick and Morty: The Future',
      content: 'Content about the future of Rick and Morty',
      author: 'RickC137'
    }
    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        expect(res.body.id).to.not.equal(null);

        expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id, publishDate: res.body.publishDate}));
      });
  });

  it('should update a blog post on PUT', function() {
    const updateData = {
      title: 'foo bar',
      content: 'a blog post about the origin of foobar',
      author: 'Jack Foo'
    }
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(Object.assign(updateData, {publishDate: res.body.publishDate}));
      });
  });

  it('should delete blog posts on DELETE', function() {
    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      return chai.request(app)
      .delete(`/blog-posts/${res.body[0].id}`);
    })
    .then(function(res) {
      expect(res).to.have.status(204);
    });
  });
});
