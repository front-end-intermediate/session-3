# III - Server Side with ExpressJS

<!-- and an Introduction to GIT -->

Today we continue to work with NPM, responsive design and start looking at Expressjs - exploring some of its capabilities.

## Homework

* Watch a [Crash Course on Express](https://youtu.be/gnsO8-xJ8rs) and follow along in your editor
* Download the done branch of this repo, review the steps below, and get the communication between the form and _your own account_ on mLab working (see the [instructions for connecting](https://docs.mlab.com/connecting/) to mLab - particulaly the sections 'MongoDB driver' for `app-alt.js` and 'mLab Data API' for `main-alt.js`)

Clone today's session:

```sh
git clone https://github.com/front-end-intermediate/session-3.git
cd session-3
code .
npm install
```

## Responsive Design with SASS

* continued from Session II:

### Concurrently

As it stands we need multiple terminal tabs to run our npm scripts. To improve this we will install a simple utility called Concurrently and write a 'master' npm script.

Stop all processes running in the terminals with Control-c and dispose of them.

Use the remaining terminal to install and register Concurrently:

* `$ npm install concurrently --save-dev`

Add some new scripts:

```js
"boom!": "concurrently \"npm run start\" \"npm run json\" \"npm run sassy\" ",
"boomlet!": "concurrently \"npm run start\" \"npm run json\" "
```

DEMO - `$ npm run boom!`

* Examine the output and inspect the html in the developer tool.
* Cancel the process with ctrl-c and add mapping to the NPM script:

```js
  "sassy": "node-sass --watch \"scss\"  --output \"app/css/\" --source-map true",
```

Run all processes:

* `$ npm run boom!`

Note the map file and the styles in the browser developer tool.

### Review

* the meta tag `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
* `min-width` vs `max-width` in media queries
* mobile first design using `min-width` to add features to wide screens
* SASS nesting and media queries

## CSS Preprocessing in the VS Code

Most editors will offer the ability do preprocessing as well as browser refresh.

[Visual Studio Code](https://code.visualstudio.com) offers an array of plug-ins that we can use to perform the SASS preprocessing function. VS Code is remarkably flexible and offers a setting for almost anything you could wish for. See the Visual Studio Code [documentation](https://code.visualstudio.com/docs/getstarted/settings) for changing settings.

[Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) for VS Code.

Quit the `boom!` process and run `boomlet`.

Install Live SASS Compiler and set the _workspace settings_ as shown:

```js
{
    "liveSassCompile.settings.formats": [
        {
            "savePath": "app/css",
            "format": "expanded"
        }
    ],
    "liveSassCompile.settings.excludeList": [
        "**/node_modules/**",
        ".vscode/**",
        "**/other/**"
    ]
}
```

Note the `.vscode` directory that is created for per project settings.

Click the `Watch Sass` button at the bottom of the editor.

### The Navbar

Note - the code responsible for adding the logo in `main.js` has been commented out:

```js
// const logo = document.querySelector('#main ul li');
// logo.classList.add('logo');
// logo.firstChild.innerHTML = '<img src="img/logo.svg" />';
```

Add a logo div to the HTML:

```html
  <nav id="main">
      <div class="logo"><img src="img/logo.svg" /></div>
    <div class="navitems"></div>
  </nav>
```

Comment out the .logo related css in `_nav.scss` and make this change in `main.js`:

`navbar.innerHTML = markup;`

Check to make sure you can see the logo in the browser.

Allow the logo to display only on small screens:

```css
.logo {
  background: white;
  @media (min-width: $break-two) {
    display: none;
  }
}

.logo img {
  padding-top: 0.25rem;
  width: 2.5rem;
}
```

And allow the navitems to display only on wide screen:

```css
.navitems {
  display: none;
  @media (min-width: $break-two) {
    display: block;
  }
}
```

Temporarily display the navitems on small screens:

```css
.navitems {
  // display: none;
  @media (min-width: $break-two) {
    display: block;
  }
}
```

Set the `ul` to display as a row or column depending on browser width using a media query:

```css
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  @media (min-width: $break-two) {
    flex-direction: row;
    height: 2.5rem;
    justify-content: center;
    align-items: center;
  }
}
```

Format the list items:

```css
li {
  flex: 1;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  @media (min-width: $break-two) {
    text-align: center;
    border-bottom: none;
  }
}
```

Rehide the navitems on small screen and code the logo to add a class to the document that we can use to show and hide them.

```js
const logo = document.querySelector('.logo');

logo.addEventListener('click', showMenu);

function showMenu() {
  document.body.classList.toggle('show');
  event.preventDefault();
}
```

Add to `_nav.scss`:

```css
body.show .navitems {
  display: block !important;
}
```

Close the navigation when one of the items is selected:

```js
function showMenu() {
  document.body.classList.toggle('show');
  const navLinks = document.querySelectorAll('.navitems a');
  navLinks.forEach(link => link.addEventListener('click', dump));
  console.log(navLinks);
  event.preventDefault();
}

function dump() {
  document.body.classList.toggle('show');
}
```

### CSS Animation

You cannot animate between `display: block` and `display: none`. These are binary conditions. We will use `max-height` instead.

```css
.navitems {
  // display: none;

  max-height: 0;
  overflow: hidden;
  transition: all 0.5s;

  @media (min-width: $break-two) {
    // display: block;

    max-height: 2.5rem;
    overflow: hidden;
  }
}
```

```css
.show .navitems {
  // display: block !important;

  max-height: 20rem;
}
```




## NODE and Express JS

### NODE

As an implementation of a JS engine ooutside the browser, Node can run JS on the server:

```sh
cd other
node script.js
```

```js
var addItems = function (num1, num2) {
  console.log( num1 + num2 )
}

addItems(1,2)
```

A simple node.js [server](https://nodejs.org/en/about/).

DEMO: Save this into `script.js` in the `other` folder and run it using `node script.js`

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

### Express

```sh
npm init -y
npm i -S express
```

[Express](https://expressjs.com/en/api.html#req) is a framework for building web applications on Node.js. It simplifies the server creation process and allows you to use JavaScript as your server-side language.

Common web-development tasks are not directly supported by Node. If you want to add specific handling for different HTTP verbs (e.g. GET, POST, DELETE, etc.), separately handle requests at different URL paths ("routes"), serve static files, or use templates to dynamically create the response, you will need to write the code yourself or use Express.

Create `index.js` in the root folder of our project.

```js
const express = require('express');
const app = express();
const port = 9000;

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});
```

Run with `$ node index.js` and test the `watchlist` route above.

Note that `console.log` is using the terminal, _not_ the browser's console. 

Also note the [get](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) verb.

Set up an NPM start command:

```js
"scripts": {
  "start": "node index.js"
},
```

Add a second route and restart the server:

```js
const express = require('express');
const app = express();
const port = 9000;
// our first route
app.get('/', function (req, res) {
  res.send('Hello World!');
}); 
// our second route
app.get('/music', function(req, res) {  
  res.send(`
    <h1>music</h1>
    <p>Commentary on music will go here.</p>
    `);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});
```

Visit [http://localhost:9000/music](http://localhost:9000/music)

Edit the second route to include a variable and restart the server:

```js
app.get('/music/:type', function(req, res) {
  let type = req.params.type;
    res.send(`
    <h1>Music</h1>
    <p>Commentary on ${type} music will go here.</p>
    `);
});
```

Restart the server and test it with [http://localhost:9000/music/baroque](http://localhost:9000/music/baroque).

## Nodemon

We need to restart the server whenever we make a change to `index.js`. Let’s streamline it by installing the nodemon NPM package.

`$ npm i -S nodemon`

To use nodemon we simply call it (instead of node) in the terminal with the name of our file. Edit the start script in `package.json`:

```js
"scripts": {
  "start": "nodemon index.js"
},
```

We no longer need to restart our server after making changes. Nodemon will watch for changes and take care of that for us.

Add a third route and restart:

```js
app.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse)
})
```





```js
const express = require('express');
const app = express();
const port = 9000;

const fs = require('fs')
// const _ = require('lodash')

const articles = [];

var content = fs.readFile('./json/travel.json', { encoding: 'utf8' }, function (err, data) {
  if (err) throw err
  JSON.parse(data).forEach(function (article) {
    articles.push(article.title);
  })
})

// our first route
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// our second route
app.get('/travel', function (req, res) {
  var buffer = ''
  articles.forEach(function (article) {
    buffer += article + '<br>'
  })
  res.send(buffer);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});

```





```js
const express = require('express');
const app = express();
const port = 9000;

const fs = require('fs');

const articles = [];

var content = fs.readFile('./json/travel.json', { encoding: 'utf8' }, function (err, data) {
  if (err) throw err
  JSON.parse(data).forEach(function (article) {
    articles.push(article.title);
  })
})

// our first route
app.get('/', function (req, res) {
  var buffer = ''
  articles.forEach(function (article) {
    buffer += `<a href="/${article}">${article}</a> <br>`
  })
  res.send(buffer);
});

app.get(/Oslo.*/, function (req, res){
  console.log('OSLO')
  next()
})

// our second route
app.get('/:article', function (req, res) {
  const article = req.params.article
  res.send(article)
});

app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});

```





```js
const express = require('express');
const app = express();
const port = 9000;

const fs = require('fs');

const articles = [];

var content = fs.readFile('./json/travel.json', { encoding: 'utf8' }, function (err, data) {
  if (err) throw err
  JSON.parse(data).forEach(function (article) {
    articles.push(article.title);
  })
})

// our first route
app.get('/', function (req, res) {
  var buffer = ''
  articles.forEach(function (article) {
    buffer += `<a href="/${article}">${article}</a> <br>`
  })
  res.send(buffer);
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

app.listen(port, function() {
  console.log(`Listening on port ${port}!`);
});

```



## Express Middleware

[Middleware](http://expressjs.com/en/resources/middleware.html) is used extensively in Express apps in order to simplify common web development tasks like working with cookies, sessions, user authentication, accessing and sending JSON, logging, etc.

DEMO: We will eventually be using [static](https://expressjs.com/en/starter/static-files.html) middleware (the only middleware _built in_ to Express) to serve files in our exercise.

Add to `index.js` (above the app.get... line):

```js
app.use(express.static('app'));
```

Comment out `app.use(express.static('app'))` - we'll make use of this later.

## CRUD

CRUD is an acronym for Create, Read, Update and Delete. It is a set of operations we get servers to execute (using the http verbs POST, GET, PUT and DELETE respectively). This is what [each operation does](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods):

* Read (GET) - Retrieve something, requests a representation of the specified resource
* Create (POST) - Make something, a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process
* Update (PUT) - Alter an existing item, if the URL refers to an already existing resource, it is modified; if not, then the server can create the resource with that URL
* Delete (DELETE)- deletes the specified resource.

As we have seen, in Express, we handle a GET request with the get method:

`app.get('/', (req, res) => res.send('Hello World!'))`

The first argument, `/,` is the path of the GET request (anything that comes after your domain name). For localhost:3000, the browser is actually looking for localhost:3000/. The path argument in this case is /.

The second argument `(req, res) => res.send('Hello World!')` is a callback function that tells the server what to do when the path is matched. It takes two arguments, a request object and a response object (req, res).

Let’s use the res object to serve an index.html page back to the browser.

sendFile is a method that’s provided by the res object:

```js
app.get('/', (req, res) => {
  // console.log(__dirname)
  res.sendFile(__dirname + '/index.html');
});
```

(`__dirname` is a global variable for the directory that contains index.js.)

Create index.html in the top level:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test</title>
</head>
<body>
  <p>Testing 1 2 3</p>
</body>
</html>
```

You should be able to see the HTML file in the browser at the specified port number.

## Proxy browser-sync

Works on port 300 (the browser-sync port)

```js
{
  "name": "session-3",
  "version": "1.0.0",
  "description": "<!-- and an Introduction to GIT -->",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js & browser-sync start --proxy localhost:9000 --files 'app'"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/front-end-intermediate/session-3.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/front-end-intermediate/session-3/issues"
  },
  "homepage": "https://github.com/front-end-intermediate/session-3#readme",
  "dependencies": {
    "browser-sync": "^2.26.3",
    "express": "^4.16.4",
    "nodemon": "^1.18.5"
  }
}
```




## CRUD - CREATE

The CREATE operation is performed only by the browser if a POST request is sent to the server. This POST request can triggered either with JavaScript or through a `<form>` element.

Add the following to index.html

```html
<form action="/entries" method="POST">
  <input type="text" placeholder="label" name="label">
  <input type="text" placeholder="header" name="header">
  <textarea type="text" placeholder="content" name="content"></textarea>
  <button type="submit">Submit</button>
</form>
```

```html
<style>
  input, textarea {
    display: block;
    margin: 1rem;
    width: 70%;
  }
</style>
```

Our form requires:

1. an action attribute
2. a method attribute
3. and name attributes on all `<input>` elements within the form

The action attribute tells the browser where to navigate to in our Express app.

The method attribute tells the browser what to request to send. In this case, it’s a POST request.

On our server, we can handle this POST request with the post method that Express provides. It takes the same arguments as the GET method:

```js
app.post('/entries', (req, res) => {
  console.log('Hello');
});
```

Add `res.redirect('/');`

Refresh your browser then click the form button. You should see 'Hello' in your command line.

Express doesn’t handle reading data from the `<form>` element on it’s own. We have to add a middleware package called body-parser to gain this functionality.

`$ npm i body-parser --save`

Make the following changes to app.js:

```js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 9000;
app.use(bodyParser.urlencoded({ extended: true }));
```

The urlencoded method within body-parser tells body-parser to extract data from the `<form>` element and add them to the body property in the request object.

Now, when you test your form, you should be able to see everything in the form field within the req.body object. Try doing a console.log:

```js
app.post('/entries', (req, res) => {
  console.log(req.body);
});
```

The object `{ label: '1', header: '2', content: '3' }` is packaged by the body parser and sent to the server as part of the request body.

## Database - MongoDB

Express apps can use any database supported by Node including PostgreSQL, MySQL, Redis, SQLite, MongoDB, etc.

We first have to install the driver for MongoDB using npm.

<!-- why the version number? -->

`$ npm install mongodb@2.2.5 --save`

Once installed, we can connect to MongoDB through the MongoClient‘s connect method.

e.g.:

```js
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('<<link-to-mongodb>>', (err, database) => {
  // ... start the server
});
```

We need to get the correct link to our database.

For our first attempt we'll use a cloud service - [MongoLab](https://mlab.com).

Create a free account with MongoLab. Once you’re done, create a new MongoDB database and set the plan to sandbox (free) and call it bcl.

Once you’re done creating the deployment, click into it and create a database user and database password.

![user](other/mlab-user.png)

![user](other/mlab-user2.jpg)

Remember these because you’re going to use it to connect the database you’ve just created.

Finally, grab the MongoDB url and add it to your MongoClient.connect method. Make sure you use your database user and password!

`MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', (err, database) => {...}`

We want to start our servers only when the database is connected so let’s move `app.listen` into the connect method. We’re also going to create a db variable to allow us to use the database when we handle requests from the browser.

```js
const MongoClient = require('mongodb').MongoClient;
```

```js
MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
});
```

Start the server and check for any errors.

```js
MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', { useNewUrlParser: true }, (err, database) => {
```

Now, let’s create a collection - a named location to store data - to store content for our application.

We can create the collection by using the string `entries` while calling MongoDB’s `db.collection()` method. Since a collection is created if it doesn't already exist we can save our first entry into the database while using the `save` method.

Also, once we’re done saving, we have to redirect the user somewhere (or they’ll be stuck waiting for our server to go the `/entries` which doesn't exist except as a post route).

In this case, we’re going to redirect them back to `/`:

```js
app.post('/entries', (req, res) => {
  db.collection('entries').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database');
    res.redirect('/');
  });
});
```

Now enter something into the `<form>` element and you’ll be able to see an entry in your MongoDB collection.

### Showing entries to users

We have to do two things to show the entries stored in MongoLab to our users.

1. Get entries from MongoLab
2. Use a some form of dynamic html (a template engine) to display the entries

We can get the entries from MongoLab by using the find method available in the collection method:

```js
app.get('/', (req, res) => {
  const cursor = db.collection('entries').find();
  console.log(cursor);
  res.sendFile(__dirname + '/index.html');
});
```

The find method returns a cursor (A Mongo Object) that probably doesn’t make much sense when you `console.log` it out.

This cursor object contains all entries from our database. It also contains a bunch of other properties and methods that allow us to work with data easily. One such method is the `toArray` method.

The `toArray` method takes in a callback function that allows us to do stuff with entries we retrieved from MongoLab. Let’s try doing a `console.log()` for the results and see what we get:

```js
app.get('/', (req, res) => {
  db
    .collection('entries')
    .find()
    .toArray((err, results) => {
      console.log(results);
      res.sendFile(__dirname + '/index.html');
    });
});
```

Refresh the page and see an array of entries in the terminal.

Let's generate HTML that displays all our entries.

## Template Engines

[Template engines](http://expressjs.com/en/guide/using-template-engines.html)

We can’t serve our index.html file and expect entries to magically appear because there’s no way to add dynamic content to a plain HTML file. What we can do instead, is to use template engines to help us out. Some popular template engines include jade/pug, Embedded JavaScript and Nunjucks.

For today, we’re going to use Embedded JavaScript (ejs) as our template engine because it’s easy to start with.

We can use EJS by first installing it, then setting the view engine in Express to ejs.

`$ npm install ejs --save`

and in app.js:

`app.set('view engine', 'ejs')`

Let’s first create an index.ejs file within a views folder so we can start populating data.

Make a `views` folder on the top level of our project and create `index.ejs` inside it.

```sh
mkdir views
touch views/index.ejs
```

Now, copy the contents of index.html into index.ejs and add.

```html
<div>
  <% for(let i=0; i<entries.length; i++) { %>
    <h2><%= entries[i].label %></h2>
    <p><%= entries[i].content %></p>
  <% } %>
</div>
```

In EJS, you can write JavaScript within `<%` and `%>` tags.

You can also output JavaScript as strings if you use the `<%=` and `%>` tags.

Here, you can see that we’re basically looping through the entries array and creating strings with `entries[i].label` and `entries[i].content`.

The complete `index.ejs` file so far should be something like:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MY APP</title>
  <style>
    input, textarea {
      display: block;
      margin: 1rem;
      width: 70%;
    }
  </style>
</head>
<body>

  <form action="/entries" method="POST">
    <input type="text" placeholder="label" name="label">
    <input type="text" placeholder="header" name="header">
    <textarea type="text" placeholder="content" name="content"></textarea>
    <button type="submit">Submit</button>
  </form>

  <div>
    <% for(var i=0; i<entries.length; i++) { %>
    <h2><%= entries[i].label %></h2>
    <p><%= entries[i].content %></p>
    <% } %>
  </div>

</body>
</html>
```

Finally, we have to render `index.ejs` when handling the GET request.

Here, we’re setting the results (an array) as the entries array we used in `index.ejs` above.

```js
app.get('/', (req, res) => {
  db
    .collection('entries')
    .find()
    .toArray((err, result) => {
      if (err) return console.log(err);
      // renders index.ejs
      res.render('index.ejs', { entries: result });
    });
});
```

Now, refresh your browser and you should be able to see all entries.

## Notes

### Integration with the old site

Add the form to `app/index.html` and change the link to point to `main-alt.js`

main-alt.js

```js
const nav = document.getElementById('main');
const navbar = nav.querySelector('.navitems');
const siteWrap = document.querySelector('.site-wrap');

// fix the navigation to the top of the page

let topOfNav = nav.offsetTop;

function fixNav() {
  if (window.scrollY >= topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav');
  } else {
    document.body.classList.remove('fixed-nav');
    0000001;
    document.body.style.paddingTop = 0;
  }
}

// Show and hide the navigation

const logo = document.querySelector('.logo');

logo.addEventListener('click', showMenu);

function showMenu(e) {
  document.body.classList.toggle('show');
  const navLinks = document.querySelectorAll('.navitems a');
  navLinks.forEach(link => link.addEventListener('click', dump));
  e.preventDefault();
}

function dump() {
  document.body.classList.toggle('show');
}

// CONTENT

// 1 build the navbar dynamically from database

fetchLab(content => {
  const markup = `<ul>
  ${content.map(listItem => `<li><a href="#${listItem.label}">${listItem.label}</a></li>`).join('')}
  </ul>`;
  navbar.innerHTML = markup;
});

// 2 set the content when the user navigates

function navigate() {
  // substr removes the hash - returns the part of a string between the start index and a number of characters after it.
  let newloc = location.hash.substr(1);
  fetchLab(content => {
    let newContent = content.filter(contentItem => contentItem.label == newloc);
    siteWrap.innerHTML = `
    <h2>${newContent[0].header}</h2>
    ${newContent[0].image}
    ${newContent[0].content}
    `;
  });
}

// NEW function for getting data - uses fetch and promises

function fetchLab(callback) {
  fetch('https://api.mlab.com/api/1/databases/bcl/collections/entries?apiKey=oZ92RXFzah01L1xNSWAZWZrm4kn6zF0n')
    // .then( res => console.log(res) )
    .then(res => res.json())
    // .then( res => console.log(res) )
    .then(data => callback(data));
}

// OLD - XMLHttpRequest replaced by fetch above

// function fetchData(hash, callback) {
//   var xhr = new XMLHttpRequest();

//   xhr.onload = function () {
//     callback(JSON.parse(xhr.response));
//   };

//   xhr.open('GET', 'http://localhost:3004/content', true);
//   xhr.send();
// }

if (!location.hash) {
  location.hash = '#watchlist';
}

navigate();

window.addEventListener('scroll', fixNav);
window.addEventListener('hashchange', navigate);
```

Create `app-alt.js` as per below and run it using `nodemon app-alt.js`.

app-alt.js

```js
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 9000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('app'));

app.post('/entries', (req, res) => {
  db.collection('entries').save(req.body, (err, result) => {
    res.redirect('/');
  });
});

app.get('*', function(req, res) {
  res.send(`
    <h1>Oopsy! Page not found</h1>
    `);
});

MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
});
```

<!-- ### Server Accounts

Username is the first seven letters of your last name + first letter of first name

Hostname is oit2.scps.nyu.edu

Password is first initial, last initial, 123890

e.g. devereld // dd123890

Test to see if your account is active by entering this URL into a new browser tab (use your username after the tilde):

`http://oit2.scps.nyu.edu/~******`

Ensure you are using sFTP (port 22).

Suggested clients: Cyberduck, FileZilla -->
