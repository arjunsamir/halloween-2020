// Import Node Modules
const http = require('http');
var fs = require('fs');


// Import NPM Modules
const dotenv = require('dotenv').config({ path: './config.env' });;
const socketio = require('socket.io');
const uniqid = require('uniqid');


// Import Custom Modules
const app = require('./app');
const Game = require('./server/Game.js');


// Create Server
const server = http.createServer(app);
const io = socketio.listen(server); 
const port = process.env.PORT || 3000;


// Load Tasks From JSON
const tasks = JSON.parse(fs.readFileSync('./server/tasks.json', 'utf8'));
let game;


// Set Up Socket Game Events
io.on('connection', socket => {
    console.log('new websocket connection');


    socket.on('request-game', () => {
        socket.emit('game-requested', tasks);
    });


    socket.on('create-game', options => {

        // Create New Game
        game = new Game(options);

        // Join Room
        socket.join(options.room);

        // Return Game Data
        socket.emit('game-created', game);

    });


    socket.on('join-game', player => {

        if (player.code == game.id) {

            game.players.push({
                id: player.id,
                name: player.name
            });

            socket.broadcast.emit('player-joined', game);

            return socket.emit('join-success', game);
        }

        else socket.emit('join-fail', 'This game does not exists');

    });

    


});



// Start the server
server.listen(port, () => {
    console.log(`App is running on port ${port} 👍`);
});


