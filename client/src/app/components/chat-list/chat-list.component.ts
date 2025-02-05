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
  searchName: string = '';
  isName: boolean = false;
  searchedUser: any = null
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
  onSearch(name: string){
    this.userService.getUserbyName(name).subscribe((user)=>{
      if(user.length > 0){
        // console.log(user)
        this.searchedUser = user[0]
        console.log(this.searchedUser)
        this.isName = true
      }else{
        this.isName =  false
      }
    },(error)=>{
      console.error(error)
      this.isName = false
    })
  }
}
