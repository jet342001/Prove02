const path = require('path');

const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const booksData = require('./routes/add-book');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
//give user access to the public folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use(booksData.routes);

//catch all routes
app.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: 'Page Not Found', path: 'wrong'});
});
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);