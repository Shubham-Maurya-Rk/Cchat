import {React,useState} from 'react'
import '../Styles/Join.css'
import logo from '../imgs/logo.png'
// import { Link } from 'react-router-dom';

// let user="";
const Join = ({setuser}) => {
    const [name, setname] = useState("");
    return (
  <div id="loginCont" className='displayCenter'>
    <div id="loginBox">
        <div id="animateBox">
            <section id="logo" className='displayCenter'>
                <img src={logo} alt="" />
                <h2>We chat</h2>
            </section>
        </div>
        <section id="loginInputs">
            <input type="text" placeholder='Name' id='name' onChange={(e)=>{setname(e.target.value);console.log(name)}}/>
            {/* <input type="password" placeholder='Password'/> */}
            {/* <Link to="/chats" onClick={redirect}> */}
                <button onClick={()=>{setuser(name)}}>Start</button>
            {/* </Link> */}
        </section>
    </div>
  </div>);
}

export default Join;
// export {user};