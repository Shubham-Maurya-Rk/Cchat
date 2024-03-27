const port=process.env.PORT || 3000;
const express=require('express')
const app=express()
const path=require("path")
const cors=require("cors")

const skt=require('socket.io')

const server=app.listen(port,()=>{
    console.log("Server started")
});

const io=skt(server);

let users={};

app.use(cors())
// app.use(express.static(path.resolve(__dirname,"../chat-app","build")))


app.get('/',(req,res)=>{
    // res.sendFile(path.resolve(__dirname,"../chat-app","build","index.html"))
    res.send("Server Working")
});

io.on('connection',(socket)=>{
    //Joined
    socket.on('joined',(user)=>{
        users[socket.id]=user;
        socket.broadcast.emit('userJoined',users[socket.id]);
    });
    
    //disconnect
    socket.on('disconnect',()=>{
        socket.broadcast.emit('userleft',["",`${users[socket.id]} left the chat`]);
    });

    //send
    socket.on('send',([user,msg,date_time])=>{
        socket.broadcast.emit('receive',[user,msg,date_time]);
    });

});


