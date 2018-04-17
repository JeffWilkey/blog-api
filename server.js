const express = require('express')
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

//log the http layer
app.use(morgan('common'))

// Seed some blog posts
BlogPosts.create('Fake Title', 'Fake Content', 'George Fakerson')
BlogPosts.create("Bob's Burgers", "Content about Bob's Burgers", "Bob Crobobolis")

app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});


app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
