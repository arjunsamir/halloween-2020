// Import Runtime
import 'regenerator-runtime/runtime';

// Import Dreams
import { dream } from './Dreams';
window.$ = dream;


import uniqid from 'uniqid';


const TESTINGMODE = true;

if (TESTINGMODE) localStorage.clear();


// Define Socket IO
const socket = window.io();

const hide = {display: 'none'};
const show = {display: 'block'};

let id;

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

    id = uniqid('name');

    socket.emit('join-game', { code, name, id, tasks: [] });

});


socket.on('join-success', game => {
    console.log(game);
    $('.player__join').css(hide);
    $('.player__waiting').css(show);
});

socket.on('join-fail', res => alert(res));


socket.on('tasks-assigned', game => {

    console.log(game);

    const comrade = game.comrades.find(comrade => comrade.id === id);

    const imposter = game.imposters.find(imposter => imposter.id === id);

    let tasks;

    if (comrade) {
        tasks = comrade.tasks;
    }

    else tasks = imposter.tasks;

    console.log(tasks)

    $('.player__tasks-container').html(tasks.map(t => `
        <div style="margin-bottom: 2rem">
            <h2>${t.name}</h2>
            <p style="margin-bottom: 1rem">${t.description}</p>
            <h4>Rules</h4>
            <p style="margin-bottom: 1rem" style="margin-bottom: 1rem">${t.rules}</p>
            <p style="font-style: italic">Hint: ${t.hint ? t.hint : 'No hint for you'}</p>
        </div> 
    `).join(''));

    $('.player__waiting').css(hide);
    $('.player__game').css(show);
    

});




