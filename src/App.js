import React, { useState} from 'react';
import VideoChat from 'twilio-video';
import './App.css';
import { BsFillChatDotsFill } from 'react-icons/bs';

function App() {
  const [roomName, setRoomName] = useState('');
  const [token, setToken] = useState('');
  const [room, setRoom] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  function handleSubmit(e) {
    e.preventDefault();
    setMessages([...messages, { name, message }]);
    setName('');
    setMessage('');
  }


  const handleJoinRoom = async ()=> {
      // Check if the room is full
      try {
        const data = await(await fetch(`/token`)).json()
        setToken(data.token)
        setRoomName(data.roomName)
      } catch (err) {
          console.log(err.message)
      }
      console.log(token)
      console.log(roomName)


    
  
    // Join a room
    VideoChat.connect(token, { name: roomName }).then(room => {
      setRoom(room);
      console.log(`Connected to ${roomName}`);

      // Attach media streams to the UI
      room.on('trackSubscribed', track => {
        const container = track.kind === 'video' ? document.getElementById('remote-media') : document.getElementById('local-media');
        container.appendChild(track.attach());
      });
    });
  }

  function handleLeaveRoom() {
    // Leave the room
    room.disconnect();
    setRoom(null);
  }

  

  return (
    room ? (
        <div>
          <h1><b>MYNGL</b><BsFillChatDotsFill/></h1>
          {/* <p>Connected to {roomName}</p> */}
          <div id = "container">
          {/* <div id="local-media"></div> */}
          <div className="remote-media" id="remote-media"></div>
          </div>
          <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Message:
          <input type="text" value={message} onChange={e => setMessage(e.target.value)} />
        </label>
        <br />
        <button type="submit">Send</button>
      </form>
      <br />
      <br />
      {messages.map((m, index) => (
        <div key={index}>
          <strong>{m.name}:</strong> {m.message}
        </div>
      ))}
    </div>
          <div id="container"><button onClick={handleLeaveRoom}>Leave room</button></div>
        </div>
      ) : (
        <div>
          <h1><b>MYNGL</b><BsFillChatDotsFill/></h1>
          <h4 className = "subtitle">MEET. GREET. TREAT.</h4>
          <div id = "container">
          {/* <form action="/postuser" id="postuser" method="POST">
            <button type = "submit" form="postuser" onClick={handleJoinRoom}>Join Room</button>
          </form> */}
          <button onClick={handleJoinRoom}><b>Join Room</b></button>
          </div>
          {/* <div id="container">
          <form action="/getname" id="name" method="POST">
            <input type="text" placeholder="Name" name="firstname"/>
            <button type="submit" form="name">Submit</button>
          </form>
          </div> */}
        </div>
      )
  );
}

export default App;
