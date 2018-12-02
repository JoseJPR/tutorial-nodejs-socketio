//Global
var connectChannel, buttonSend, listMessages, inputMessage, containerMessages, buttonExit, containerLogin, containerChat;
var socket = io(); 

//Set Channel
const channel = "TestChannel";

document.addEventListener("DOMContentLoaded", function(event) {
  connectChannel = document.querySelector("#connectChannel");
  buttonSend = document.querySelector("#buttonSend");
  listMessages = document.querySelector("#listMessages");
  inputMessage = document.querySelector("#inputMessage");
  containerMessages = document.querySelector("#containerMessages");
  buttonExit = document.querySelector("#buttonExit");
  containerLogin = document.querySelector('#containerLogin');
  containerChat = document.querySelector('#containerChat');

  //Save localstorage channel name
  localStorage.setItem('channel', channel);
  if(!localStorage.getItem('channel') || !localStorage.getItem('name')){
    document.querySelector('#containerLogin #channel').value = localStorage.getItem('channel');
    localStorage.setItem('color', createColor());
    document.querySelector('#containerLogin #boxColor').style.backgroundColor = '#' + localStorage.getItem('color');
  }else{
    buttonExit.classList.remove('hide');
    containerLogin.classList.add('hide');
    containerChat.classList.remove('hide');
  }

  //Button exit user and remove localstorage
  buttonExit.onclick = function(){
    localStorage.clear();
    containerLogin.classList.remove('hide');
    containerChat.classList.add('hide');
    buttonExit.classList.add('hide');
    location.reload();
  }

  //Button login user
  connectChannel.onclick = function(){
    if(
      document.querySelector('#containerLogin #channel').value != '' 
      && 
      document.querySelector('#containerLogin #name').value != ''
    ){
      localStorage.setItem('channel', document.querySelector('#containerLogin #channel').value);
      localStorage.setItem('name', document.querySelector('#containerLogin #name').value);
      containerLogin.classList.add('hide');
      containerChat.classList.remove('hide');
      buttonExit.classList.remove('hide');
    }else{
      alert('Ups! Channel name and your name is required.');
    }
  }

  //Button send message into channel socket
  buttonSend.onclick = function(){
    sendMessage(inputMessage.value);
  }

  //Enter keyup send message into channel socket
  inputMessage.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      sendMessage(inputMessage.value);
    }
  });

  //Socket start to load data received
  socket.on(localStorage.getItem('channel'), function(data){
    addMessage(data);
  });

});

//Create random user color
const createColor = function(){
  return Math.floor(Math.random()*16777215).toString(16);
}

//Send messate to channel socket
const sendMessage = function (txt){
  if(txt != ""){
    socket.emit(localStorage.getItem('channel'), { user: { name: localStorage.getItem('name'), color: localStorage.getItem('color') }, msg: txt });
    inputMessage.value = "";
  }
}

//Add message into list ul
const addMessage = function(data){
  listMessages.insertAdjacentHTML("beforeend", '<li><div class="content-msg shadow-sm" style="background-color:#' + data.user.color + '"><div class="name">' + data.user.name + '</div><div class="txt">' + data.msg + '</div></div></li>');
  gotoBottom(containerMessages);
}

//Send scroll list message bottom
const gotoBottom = function(e){
  e.scrollTop = e.scrollHeight - e.clientHeight;
}