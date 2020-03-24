// import 

var express = require('express')
var BodyParser = require('body-parser')
var apiRouter = require('./ApiRoute').router

var server = express()

server.use(BodyParser.urlencoded({extended: true}))
server.use(BodyParser.json())

server.get('/', function(req,res){
    res.header('Content-Type', 'text/html');
    res.status(200).send('<h1>API POWER SOLAR</h1>');
});

server.use('/api/', apiRouter)

server.listen(80, function(){
    console.log('Server ecoute sur le port 8080');
});