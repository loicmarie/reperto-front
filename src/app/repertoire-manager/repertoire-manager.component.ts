import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-repertoire-manager',
  templateUrl: './repertoire-manager.component.html',
  styleUrls: ['./repertoire-manager.component.css']
})
export class RepertoireManagerComponent implements OnInit {

  constructor(private userService: UserService,
    private auth: AuthService) {

    this.auth.handleAuthentication().subscribe(user => {}, error => {});
  }

  ngOnInit() {
  }

}
