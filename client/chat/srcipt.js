const socket = window.io('http://localhost:4000');


const messageForm = document.querySelector('#send-container');
const messageInput = document.querySelector('#message-input');
const messageContainer = document.querySelector('#message-container');


const appendMessage = msg => {
    messageContainer.insertAdjacentHTML('beforeend', `<div>${msg}</div>`);
}


const name = prompt('What is your name?');
appendMessage('You Joined');
socket.emit('new-user', name);

socket.on('chat-message', data => {
    appendMessage(`${data.user}: ${data.message}`);
    console.log(data);
});

socket.on('user-connected', name => {
    appendMessage(`${name} joined`);
});

socket.on('user-disconnected', name => {
    appendMessage(`${name} left`);
});


messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;

    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);

    messageInput.value = '';
});


