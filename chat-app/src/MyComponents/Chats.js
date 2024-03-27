import { React, useEffect, useRef, useState } from 'react';
import '../Styles/Chat.css';
import logo from '../imgs/logo.png'
import bottomArrow from '../imgs/bottom-arrow.png'
import socketIo from 'socket.io-client';
// import { user } from './Join'

const ENDPOINT = window.location.origin;
// const ENDPOINT = "http://localhost:3001";
let socket;
const Chats = ({ user }) => {
  const [messages, setmessages] = useState([]);
  const formatTime = (time) => time < 10 ? `0${time}` : time;
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  //funtion to send message
  const sendMsg = (e) => {
    e.preventDefault();
    const msg = document.getElementById('msgBox').value;
    if(msg==="")return;
    const date = new Date();
    let date_time = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${formatTime(date.getHours())}:${formatTime(date.getMinutes())}`;
    setmessages(messages => [...messages, ['You', msg, date_time]]);
    document.getElementById('msgBox').value = '';
    socket.emit('send', [user, msg, date_time]);
  }

  useEffect(() => {
    scrollToBottom();
    socket = socketIo(ENDPOINT, { transports: ['websocket'] });
    //Connect
    socket.on('connect', () => {
      setmessages(messages => [...messages, ['', "You Joined the chat"]]);
      //Joined
      socket.emit('joined', user);
      alert('Connected');
    });

    //userJoined
    socket.on('userJoined', (username) => {
      setmessages(messages => [...messages, ['', `${username} Joined the chat`]]);
    });

    //user left
    socket.on('userleft', ([username, message]) => {
      setmessages(messages => [...messages, [username, message]]);
    });

    //receive
    socket.on('receive', ([user, msg, date_time]) => {
      setmessages(messages => [...messages, [user, msg, date_time]]);
    });

    return () => {
      socket.close();
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  

  return (<div id='chatCont' className='displayCenter'>
    <div id="chatBox">
      <div id="chatLogo" className='displayCenter'>
        <div className='displayCenter'>
          <img src={logo} alt="" />
          <h2>We chat</h2>
        </div>
      </div>
      <div id="chat">
          {
            messages && messages.map((msg, idx) => {
              return msg[0] === "" ? <div key={idx} className='joined'>{msg[1]}</div> :
                <div key={idx} className={`msg float-${msg[0] === "You" ? "right" : "left"}`}>
                  <h6>~{msg[0]}</h6>
                  <p className='word-break'>{msg[1]}</p>
                  <small className='date-time'>{msg[2]}</small>
                </div>
            })
          }
          <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMsg} id="inputBox" className='displayCenter'>
        <span className='scrolltobottom displayCenter' onClick={scrollToBottom}><img src={bottomArrow} alt="" /></span>
        <input type="text" placeholder='Message...' id='msgBox' />
        <button type='submit'></button>
      </form>
    </div>
  </div>)
}

export default Chats