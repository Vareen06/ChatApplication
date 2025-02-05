import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/message';
  private socket = io('http://localhost:5000'); // Connect to backend via Socket.io

  constructor(private http: HttpClient) {}

  getMessages(senderId: string, receiverId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${senderId}/${receiverId}`);
  }

  updateMessage(_id: string, messageText: string): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/update/${_id}`,{messageText});
  }

  deleteMessage(_id: string): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/delete/${_id}`)
  }

  joinChat(senderId: string, receiverId: string) {
    this.socket.emit('joinChat', { senderId, receiverId });
  }

  sendMessage(messageData: {
    senderId: string;
    receiverId: string;
    messageText: string;
    roomId: string;
  }) {
    this.socket.emit('sendMessage', messageData);
  }

  saveMessages(messageData: {
    senderId: string;
    receiverId: string;
    messageText: string;
    roomId: string;
}): Observable<{ _id: string; senderId: string; receiverId: string; messageText: string; roomId: string }> {
    return this.http.post<{ _id: string; senderId: string; receiverId: string; messageText: string; roomId: string }>(
        `${this.apiUrl}/send`,
        messageData,
        {
            headers: { 'Content-type': 'application/json' },
        }
    );
}


  listenForMessages(): Observable<{_id: string, roomId: string, senderId: string, receiverId: string, messageText: string}> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (message) => {
        console.log('Received message:', message);

        observer.next(message);
      });
    });
  }

  emitUpdateMessage(updatedMessage: any) {
    this.socket.emit('UpdateMessage', updatedMessage);
  }
  
  listenForMessageUpdates(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('Message-updated', (updatedMessage) => {
        console.log('Message after Updation', updatedMessage)
        observer.next(updatedMessage);
      });
    });
  }
  
  emitDeleteMessage(deletedMessage: any) {
    this.socket.emit('deleteMessage', deletedMessage);
  }
  listenForMessageDeletions(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('Message-deleted', (deletedMessage) => {
        observer.next(deletedMessage);
      });
    });
  }
  
}
