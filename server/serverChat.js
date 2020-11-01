const io = require('socket.io')(4000);

const users = {};

io.on('connection', socket => {
    console.log('New User')
    socket.emit('chat-message', 'Hello World');

    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    })

    socket.on('send-chat-message', message => {
        console.log(message);
        socket.broadcast.emit('chat-message', { message, user: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id];
    })

});

/* 

    call join session API to register phone number and recieve an ID (if there is no id saved in localstorage)

    Once the id is saved on the client, save the id in localstorage

    Once a user has an id establish a websocket connection.

    websocket connections will emit game events 

    users can send in game chat messages

*/