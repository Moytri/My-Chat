var express=require('express'),
    app=express(),
    server=require('http').createServer(app),
    io=require('socket.io').listen(server);
    var nicknames=[];


    server.listen(8000);


    app.get('/', function(req, res){
        res.sendfile(__dirname+'/index.html');
    });
    
     io.sockets.on('connection', function(socket){
        socket.on('new user',function(message,callback)
        {
           if(nicknames.indexOf(message)!=-1) {
               callback(false);
           }else {
               callback(true);
               socket.nickname=message;
               nicknames.push(socket.nickname);
               io.sockets.emit('usernames',nicknames);
               updateNicknames();
           }
        });
        function updateNicknames(){
            io.sockets.emit('usernames', nicknames);
        }

        socket.on('send message', function(message){
            io.sockets.emit('new message', {msg: message, nick: socket.nickname});
        });

        socket.on('disconnect', function(message){
            if(!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1);
            updateNicknames();
        });

    });