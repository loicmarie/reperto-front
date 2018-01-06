import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { ChessSettings } from '../chess.settings';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  startFEN: string = ChessSettings.START_FEN;

  constructor(private auth: AuthService) {
    this.auth.handleAuthentication().subscribe(user => {}, error => {});
  }

  ngOnInit() {
  }

}
