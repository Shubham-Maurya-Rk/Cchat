import { React, useEffect, useState } from 'react';
import '../Styles/Chat.css';
import logo from '../imgs/logo.png'
import socketIo from 'socket.io-client';
// import { user } from './Join'

const ENDPOINT = window.location.origin;
let socket;
const Chats = ({ user }) => {

  const [messages, setmessages] = useState([]);
  //funtion to send message
  const formatTime=(time)=>time<10?`0${time}`:time;

  const sendMsg = (e) => {
    e.preventDefault();
    const msg = document.getElementById('msgBox').value;
    const date=new Date();
    let date_time=`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${formatTime(date.getHours())}:${formatTime(date.getMinutes())}`;
    setmessages(messages => [...messages, ['You', msg,date_time]]);
    document.getElementById('msgBox').value = '';
    socket.emit('send', [user, msg, date_time]);
  }

  useEffect(() => {

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
      // console.log(`userJoined --- ${username} joined the chat`);
      setmessages(messages => [...messages, ['', `${username} Joined the chat`]]);
    });

    //user left
    socket.on('userleft', ([username, message]) => {
      setmessages([...messages, [username, message]]);
      // console.log(`userleft ---> ${message}`);
    });

    //receive
    socket.on('receive', ([user, msg,date_time]) => {
      // console.log("Receiver: ",user)
      setmessages(messages => [...messages, [user, msg,date_time]]);
    });

    return () => {
      socket.close();
    }
    // eslint-disable-next-line
  }, [])

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
              <div className={`msg float-${msg[0] === "You" ? "right" : "left"}`}>
                <h6>{msg[0]}</h6>
                <p>{msg[1]}</p>
                <small className='date-time'>{msg[2]}</small>
              </div>
          })
        }
      </div>

      <form onSubmit={sendMsg} id="inputBox" className='displayCenter'>
        <input type="text" id='msgBox' />
        <button type='submit'></button>
      </form>
    </div>
  </div>)
}

export default Chats