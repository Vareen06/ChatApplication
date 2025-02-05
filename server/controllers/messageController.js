const Message = require('../models/Message');

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, messageText,roomId } = req.body;
    const newMessage = new Message({
      senderId,
      receiverId,
      messageText,
      roomId
    });
    await newMessage.save();

    // Return the saved message, excluding __v
    res.status(200).json(newMessage.toObject({ versionKey: false })); 
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};


const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    // Validate that senderId and receiverId are provided
    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'Both senderId and receiverId are required' });
    }

    // Fetch messages where sender and receiver are either (senderId, receiverId) or (receiverId, senderId)
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).select('-__v');  // Exclude the __v field

    // Check if messages exist
    if (messages.length === 0) {
      return res.status(404).json({ message: 'No messages found between the users' });
    }

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const updateMessage = async(req,res) =>{
  try{
    const {id} = req.params
    const {messageText} =  req.body
    const message = await Message.findById(id)
    if (!message) return res.status(404).json({msg:`No such message exist`})

    const updatedMessage = await Message.findByIdAndUpdate(id,
      {messageText},
      {new: true}
    )
    res.status(200).json({msg:`Message Updated Successfully`,updatedMessage})
  }catch(err){
    res.status(500).json({msg:`Something went wrong: ${err.message}`})
  }
}

const deleteMessage = async(req,res)=>{
  try{
    const {id} = req.params

    const message = await Message.findById(id)
    if(!message) return res.status(400).json({msg:`No such message exists`})

    const deletedMessage = await Message.findByIdAndDelete(id)

    res.status(200).json({msg:`Message Deleted Successfully`,deletedMessage})
  }catch(err){
    res.status(500).json({msg:`Something went wrong: ${err.message}`})
  }
}


module.exports = {getMessages, sendMessage, updateMessage, deleteMessage}