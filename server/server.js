const express = require('express');
const {createServer} = require('http');
const connectDB = require('./config/db')
const routerUser = require('./routes/userRoutes')
const routerMessage = require('./routes/messageRoutes')
const cors = require('cors')
const app = express();
const server = createServer(app);
const {setupSocket} = require('./socket')



app.use(express.json());
app.use(cors())

connectDB()


app.use('/api/user',routerUser)
app.use('/api/message',routerMessage)

setupSocket(server)

server.listen(5000, () => {
    
  console.log('Server is running on port 5000');
});
