import Join from './MyComponents/Join';
import Chats from './MyComponents/Chats';
import './App.css'
// import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useState } from 'react';

function App() {
  const [user, setuser] = useState("")
  return (<>
     {/* <Router>
      <Routes>
        <Route path="/" element={<Join/>}/>
        <Route path="/chats" element={<Chats/>}/>
      </Routes>
     </Router> */}
     {user?<Chats user={user}/>:<Join setuser={setuser}/>}
  </>);
}

export default App;
