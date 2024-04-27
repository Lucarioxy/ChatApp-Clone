const express = require("express");
const chats = require("./data/data.js");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const colors = require("colors")
const userRoutes = require("./routes/userRoutes.js")
const chatRoutes = require("./routes/chatRoutes.js")
const messageRoutes = require("./routes/messageRoutes.js")
const {NotFound,errorHandler} = require("./middlewares/errorMiddleware.js")

const app = express();
dotenv.config();
app.use(cors());
const server = require('http').createServer(app);

connectDB();

app.use(express.json());
// to except json data 


app.get("/",(req,res)=>{
    res.send("Hello");
})

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

app.use(NotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"*"
    }
});

io.on("connection",(socket)=>{
    console.log("connected to socket.io")

    // we are creating a socket where the person can join in the room
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    });

    // it will take a room id from the front end
    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("User Joined Room : "+ room);
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing");
    })
    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing");
    })

    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id === newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved",newMessageRecieved);
        });
    })

    socket.off("setup",()=>{
        console.log("User Disconnected");
        socket.leave(userData._id);
    })

})

server.listen(PORT,console.log(`Server Started on PORT ${PORT}`.yellow.bold));

