import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private userService: UserService) {}

  login() {
    this.userService.login(this.email, this.password).subscribe(
      (response) => {
        if (response) {
          console.log(response)
          sessionStorage.setItem('userId', response.userId);  
          this.router.navigate(['/chat-list']);  
        }
      },
      (error) => {
        this.errorMessage = 'Invalid credentials'; 
      }
    );
  }
}
