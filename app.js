
/**
 * Module dependencies.
 */

var express = require('express');
var engine = require('ejs-locals');
var routes = require('./routes');
routes.graph = require('./routes/graph').graph;
var http = require('http');
var path = require('path');
var Mongoose = require('mongoose');

var db = Mongoose.createConnection('localhost', 'mytestapp');
var TodoSchema = require('./models/Todo.js').TodoSchema;
var Todo = db.model('todos', TodoSchema);

var app = express();
app.engine('ejs',engine);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index(Todo));
app.get('/graph', routes.graph);
app.get('/graphUpdate', routes.graphUpdate);
app.post('/todo.json', routes.addTodo(Todo));
app.put('/todo/:id.json', routes.update(Todo));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});