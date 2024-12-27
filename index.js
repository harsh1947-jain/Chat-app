

// // const express = require('express');
// // const http = require('http');
// // const socketIo = require('socket.io');

// // const { addUser,removeUser,getUser,getUserInRoom } =require('./users');

// // const app = express();
// // const server = http.createServer(app);

// // const io = socketIo(server, {
// //   cors: {
// //     origin: "http://localhost:5173", // Allow requests from this origin (your client)
// //     methods: ["GET", "POST"],
// //     allowedHeaders: ["Content-Type"],
// //     credentials: true // Allow credentials like cookies, if necessary
// //   }
// // });

// // io.on('connection', (socket) => {
// //   console.log('New client connected');
   
// //   socket.on('join',({name,room},callback)=>
// //   {
// //     {

// //         console.log(socket.id);
// //         console.log({name,room});

// //        const { error,user }= addUser({id:socket.id,name,room});

// //        if(error) return callback(error);

// //        socket.emit('message',{user:'admin',text:`${user.name} Welcome to room ${user.room}`});

// //        socket.broadcast.to(user.room).emit('message',{user:'admin', text:`${user.name} has joined`});



// //        socket.join(user.room);

    
      
// //     }
// //   });

// //   socket.on('sendMessage',(message,callback)=>
// //   {
// //      const user=getUser(id);

// //      io.to(user,room).emit('message',{user:user.name,text:message});

   

// //   })

// //   socket.on('disconnect', () => {
// //     console.log('Client disconnected');
// //   });
// // });

// // const PORT = 5000;
// // server.listen(PORT, () => {
// //   console.log(`Server running on port ${PORT}`);
// // });


// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const { addUser, removeUser, getUser, getUserInRoom } = require('./users');

// const app = express();
// const server = http.createServer(app);

// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:5173", // Allow requests from this origin (your client)
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//     credentials: true // Allow credentials like cookies, if necessary
//   }
// });

// io.on('connection', (socket) => {
//   console.log('New client connected');
   
//   socket.on('join', ({ name, room }, callback) => {
//     console.log(socket.id);
//     console.log({ name, room });

//     const { error, user } = addUser({ id: socket.id, name, room });

//     if (error) return callback(error);

//     // Emit welcome message to the new user
//     socket.emit('message', { user: 'admin', text: `${user.name} Welcome to room ${user.room}` });

//     // Broadcast to the room that a new user has joined
//     socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });

//     // Join the user to the room
//     socket.join(user.room);
//   });

//   // Handle sending messages
//   socket.on('sendMessage', (message, callback) => {
//     const user = getUser(socket.id); // Use socket.id to get the user
//     if (user) {
//       io.to(user.room).emit('message', { user: user.name, text: message }); // Emit to the room the user is in
//     }
//     callback(); // Acknowledge the message send action
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//     const user = removeUser(socket.id); // Remove user when they disconnect
//     if (user) {
//       io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` }); // Notify room of disconnect
//     }
//   });
// });

// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log(name,room);

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });


  });

  socket.on('sendMessage', (message) => {
    const user = getUser(socket.id);
     console.log(user);

    if (user) {
      io.to(user.room).emit('message', { user: user.name, text: message });
    }

   
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
