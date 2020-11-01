// Import Runtime
import 'regenerator-runtime/runtime';

// Import Dreams
import { dream } from './Dreams';
window.$ = dream;


import uniqid from 'uniqid';

// Define Socket IO
const socket = window.io();

const hide = {display: 'none'};
const show = {display: 'block'};

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

if (code) {
    $('.player__join-code').css(hide);
    $('.player__join-name').css(show);
}

$('#enter-game').on('click', () => {

    code = $('#game-code').val();

    if (code.length < 6) return alert('Please enter a valid game code');

    $('.player__join-code').css(hide);
    $('.player__join-name').css(show);

});






$('#join-game').on('click', () => {

    const name = $('#player-name').val();

    if (!name) return alert('Please enter a username');

    socket.emit('join-game', { code, name, id: uniqid('name') });

});


socket.on('join-success', game => console.log(game));

socket.on('join-fail', res => alert(res));




