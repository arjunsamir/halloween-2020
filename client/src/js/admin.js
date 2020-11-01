// Import Runtime
import 'regenerator-runtime/runtime';

// Import Dreams
import { dream } from './Dreams';
window.$ = dream;
import uniqid from 'uniqid';
import QRCode from './QR';

// Define Socket IO
const socket = window.io();

let tasksArray = [];




// Attach Game Events
$('#request-game').on('click', () => socket.emit('request-game'));
$('#start-game').on('click', () => socket.emit('start-game'));
$('#finish-game').on('click', () => socket.emit('finish-game'));
$('#terminate-game').on('click', () => socket.emit('terminate-game'));


$('#create-game').on('click', () => {
    
    const game = {
        id: uniqid().substr(2, 6),
        room: $('#room-name').val(),
        tasks: $('.admin__task input').filter(e => e.checked).map(e => tasksArray[e.value]),
        duration: $('#duration').val('int') || 30,
        imposterRatio: $('#ratio').val('float') || .2,
        tasksAverage: $('#tasks-avg').val('int') || 5,
        prefersShortTasks: $('#prefers').e().checked ?? false,
        emergencyMeetings: $('#emergency-meetings').val('int') || 1
    };

    socket.emit('create-game', game);

});

const hide = {display: 'none'};
const show = {display: 'block'};



socket.on('game-requested', tasks => {

    tasksArray = tasks.map(t => {
        return {id: uniqid(), task: t };
    });

    console.log(tasks);
    $('.admin__tasks-container').insert(tasksArray.map(t => `
        <label class="admin__task"><input value="${t.id}" type="checkbox" checked><span>${t.task.name}</span></label>
    `).join(''));

    const tsk = {};

    tasksArray.forEach(t => tsk[t.id] = t.task);

    tasksArray = tsk;

    $('.admin__request').css(hide);
    $('.admin__settings').css(show);

});


socket.on('game-created', game => {

    console.log(game);

                
    new QRCode($('.admin__qr-code').e(), {
        text: `https://www.arjun/party?code=${game.id}`,
        width: 200,
        height: 200,
        colorDark: '#333333',
        colorLight: '#ffffff',
        correctLevel : QRCode.CorrectLevel.H
    });

    $('.admin__game-code').text(game.id);

    $('.admin__settings').css(hide);
    $('.admin__waiting-room').css(show);

});


socket.on('game-started', game => {

    $('.admin__waiting-room').css(hide);
    $('.admin__game-display').css(show);

});


socket.on('game-finished', game => {



});

socket.on('game-terminated', game => {

});


socket.on('player-joined', game => {

    $('.admin__waiting-count').text(`${game.players.length} players in session`);
    $('.admin__waiting-players').html('');
    $('.admin__waiting-players').html(game.players.map(p => `<p>${p.name}</p>`).join(''));

})