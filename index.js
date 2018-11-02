const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 9000;
app.use(bodyParser.urlencoded({ extended: true }));

const fs = require('fs');

const mongourl = 'mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl'

const articles = [];

var content = fs.readFile('./json/travel.json', { encoding: 'utf8' }, function (err, data) {
  if (err) throw err
  JSON.parse(data).forEach(function (article) {
    articles.push(article.title);
  })
})

MongoClient.connect(mongourl, (err, client) => {  
  if (err) {
    return console.log(err);
  }
  db = client.db('bcl')
  // Do something with db here, like inserting a record
  db.collection('notes').insertOne(
    {
      title: 'Hello MongoDB',
      text: 'Hopefully this works!'
    },
    function (err, res) {
      if (err) {
        client.close();
        return console.log(err);
      }
      // Success
      client.close();
    }
  )
});

// app.use(express.static('app'));

// app.post('/entries', (req, res) => {
//   db.collection('entries').save(req.body, (err, result) => {
//     if (err) return console.log(err);
//     console.log('saved to database');
//     res.redirect('/');
//   });
// });

// our first route
app.get('/', (req, res) => {
  // console.log(__dirname)
  res.sendFile(__dirname + '/app/form.html');
});

app.get(/Oslo.*/, function (req, res, next){
  console.log('OSLO')
  next()
})

// our second route
app.get('/:article', function (req, res) {
  const article = req.params.article
  res.send(article)
});

// MongoClient.connect(mongourl, { useNewUrlParser: true }, (err, db) => {
//   if (err) return console.log(err);
  // db = db;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
// });

