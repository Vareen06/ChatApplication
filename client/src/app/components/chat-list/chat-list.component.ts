import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css'],
})
export class ChatListComponent implements OnInit {
  users: any[] = [];
  senderId: string = sessionStorage.getItem('userId') || ''; 

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {

    if (!this.senderId) {
      console.log(this.senderId)
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      // console.log(data); 
    });
  }

  logOut(){
    sessionStorage.removeItem('userId')
    this.router.navigate(['/login'])
  }
}
