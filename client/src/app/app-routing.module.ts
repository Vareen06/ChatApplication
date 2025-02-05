import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';  // Import your login component
import { RegisterComponent } from './components/register/register.component';  // Import your register component
import { ChatListComponent } from './components/chat-list/chat-list.component';  // Import your chat list component
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chat-list', component: ChatListComponent }, 
  // { path: `chat-list?name=${name}`, component: ChatListComponent},
  {path: 'chat/:senderId/:receiverId/:receiverName', component: ChatComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
