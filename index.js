const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const engines = require('consolidate');

const app = express();
const port = 9000;
const log = console.log;
const articles = [];

app.use(express.static('app'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/storyimages/', express.static('app/img'));

app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')

// our first route
app.get('/', (req, res) => {
  db
    .collection('entries')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      res.render('index', { entries: result });
    });
});

app.post('/entries', (req, res) => {
  db.collection('entries').insertOne(req.body, (err, result) => {
    if (err) return log(err)
    log('saved to database')
    res.redirect('/');
  })
})

// our third route
app.get('/:article', function (req, res) {
  const article = req.params.article
  var buffer = '';
  if (res.loc){
    buffer += res.loc + ' <br/>'
  }
  buffer += article + '<br>'
  buffer += '<a href="/">Back</a>'
  res.send(buffer);
});

MongoClient.connect(
  'mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);
  db = client.db('bcl');
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
});

// var content = fs.readFile('./other/json/travel.json', { encoding: 'utf8' }, function (err, data) {
//   if (err) throw err
//   JSON.parse(data).forEach(function (article) {
//     var story = {}
//     story.title = article.title;
//     story.abstract = article.abstract;
//     story.image = Math.floor(Math.random() * 3 +1)
//     articles.push(story);
//   })
//   log(articles)
// })

// app.get(/Oslo.*/, function (req, res, next){
//   console.log('OSLO');
//   const location = 'Norway';
//   res.location = location;
//   next()
// })


// our second route
// app.get('/music/:type', function(req, res) {
//   const reverse = [...req.params.type].reverse().join(''); // NEW
//   let type = reverse;
//     res.send(`
//     <h1>Music</h1>
//     <p>Commentary on ${type} music will go here.</p>
//     `);
// });