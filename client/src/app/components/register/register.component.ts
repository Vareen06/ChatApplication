import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';  // Replace with your actual service

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private userService: UserService) {}

  register() {
    this.userService.register(this.name, this.email, this.password).subscribe(
      (response) => {
        // Assuming userService.register returns the user object or a success message
        if (response) {
          this.router.navigate(['/login']);  // Redirect to login page after successful registration
        }
      },
      (error) => {
        this.errorMessage = error.message;  // Show error message
      }
    );
  }
}
