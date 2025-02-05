const express = require('express');
const messageController = require('../controllers/messageController');
const router = express.Router();

router.post('/send', messageController.sendMessage);
router.get('/:senderId/:receiverId', messageController.getMessages);
router.put('/update/:id',messageController.updateMessage)
router.delete('/delete/:id', messageController.deleteMessage)

module.exports = router;
