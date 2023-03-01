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
  

  const handleJoinRoom = async ()=> {
      // Check if the room is full
      try {
        const data = await fetch(`https://mynglbackend.vercel.app/token`)
        .then(res => res.json()
        )
          // Join a room
    VideoChat.connect(data.token, { name: data.roomName }).then(room => {
      setRoom(room);
      console.log(`Connected to ${data.roomName }`);

      // Attach media streams to the UI
      room.on('trackSubscribed', track => {
        const container = track.kind === 'video' ? document.getElementById('remote-media') : document.getElementById('local-media');
        container.appendChild(track.attach());
      });
    });
      } catch (err) {
          console.log(err.message)
      }
      console.log("Token", token)
      console.log("Room Name", roomName)
  
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
