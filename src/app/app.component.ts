import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Reperto';
    subtitle = 'Chess variant trainer';
    constructor(private auth: AuthService) {
      this.auth.handleAuthentication().subscribe(user => {
        console.log(auth.user, auth.isAuthenticated());
      }, error => {});
    }
}
