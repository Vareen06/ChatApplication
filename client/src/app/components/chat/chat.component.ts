import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  senderId: string = sessionStorage.getItem('userId') || '';
  receiverId: string = '';
  receiverName: string = '';
  messages: any[] = [];
  messageText = '';
  editingMessageId: string | null =null

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.receiverId = params.get('receiverId')!;
      this.receiverName = params.get('receiverName')!;

      // Generate roomId and store it in session storage
      const roomId = `${this.senderId}-${this.receiverId}`;
      sessionStorage.setItem('roomId', roomId);

      this.chatService.joinChat(this.senderId, this.receiverId);

      // Fetch messages from backend
      this.chatService.getMessages(this.senderId, this.receiverId).subscribe(
        (data) => {
          this.messages = data;
          console.log(data);
        },
        (err) => {
          console.error('Error fetching messages:', err);
        }
      );
      this.chatService.listenForMessages().subscribe((message) => {
        this.messages.push(message);
        // console.log(this.messages)
      });
      this.chatService.listenForMessageUpdates().subscribe((updatedMessage) => {
        const updatedMessageId = updatedMessage.updatedMessage._id;
        // console.log(updatedMessageId);
      
        // Find the index of the message to be updated
        const index = this.messages.findIndex((msg) => msg._id === updatedMessageId);
        // console.log(index);
      
        if (index !== -1) {
          // Ensure that only the targeted message is updated
          this.messages = this.messages.map((msg) => 
            msg._id === updatedMessageId ? { ...msg, messageText: updatedMessage.updatedMessage.messageText } : msg
          );
          console.log("Updated message:", this.messages[index]);
        } else {
          console.log("Message not found for update");
        }
      });
  
      // Listen for deleted messages
      this.chatService.listenForMessageDeletions().subscribe((deletedMessage) => {
        this.messages = this.messages.filter(msg => msg._id !== deletedMessage._id);
      });
    });
  }

  sendMessage() {
    if (this.messageText.trim()) {
      const roomId = sessionStorage.getItem('roomId') || '';
      const messageData = {
        roomId: roomId,
        senderId: this.senderId,
        receiverId: this.receiverId,
        messageText: this.messageText,
      };
      // console.log(messageData)

      this.chatService.saveMessages(messageData).subscribe(
        (data: any) => {
          // console.log("data",data)
          const formattedMessage = {
            _id: data._id,
            senderId: data.senderId,
            receiverId: data.receiverId,
            messageText: data.messageText,
            roomId: roomId,
          };
          // console.log(formattedMessage)
          this.chatService.sendMessage(formattedMessage);

          this.messageText = '';
        },
        (error) => {
          console.error('Error saving message:', error);
        }
      );
    }
  }

  editMessage(_id: string, text: string) {
    // Set input field with the current message text
    this.messageText = text;
    this.editingMessageId = _id; 
    // console.log(this.editingMessageId)
  }
  updateEditedMessage() {
    if (this.editingMessageId) {
      this.chatService.updateMessage(this.editingMessageId, this.messageText).subscribe(
        (updatedData) => {
          this.chatService.emitUpdateMessage(updatedData);
          // console.log('Message updated:', updatedData);
          this.editingMessageId = null; 
          this.messageText = ''
        },
        (error) => {
          console.error('Error updating message:', error);
        }
      );
    }
  }
  
  deleteMessage(_id: string) {
    this.chatService.deleteMessage(_id).subscribe(
      (data) => {
        console.log('Message deleted:', data);
        this.chatService.emitDeleteMessage({ _id }); 
      },
      (error) => {
        console.error('Error deleting message:', error);
      }
    );
  }
  
}
