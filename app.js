/*jshint node: true */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Serwer nasłuchuje na porcie " + app.get('port'));
});

var io = require('socket.io');
var socket = io.listen(server);

var imgDb = require('./lib/imgDb')();

socket.on('connection', function (client) {
    'use strict';

    imgDb.getAllData(client, function(client){
        var imgs = imgDb.getAllImgs();
        for(var i = 0; i < imgs.length; i++){
            client.emit('setNewImg', imgs[i]);
        }
    });

    client.on('addNewImg', function(data) {
        var id = imgDb.addNewImg(data);
        data.id = id;
        // console.log(data);
        client.emit('setNewImg', imgDb.getImgById(id));
        client.broadcast.emit('setNewImg', imgDb.getImgById(id));
    });
    
});