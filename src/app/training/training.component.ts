import { Component, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { AuthService } from '../auth.service';
import { VariantService } from '../variant.service';
import { ChessSettings } from '../chess.settings';
import { Variant } from '../variant';
import { Move } from '../move';
import { ChessboardComponent } from '../chessboard/chessboard.component';
import { TrainingSessionService } from '../training-session.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements AfterViewInit {

  @ViewChildren('chessboard') chessboards;
  variant: Variant;

  constructor(private auth: AuthService,
    private variantService: VariantService,
    private trainingSess: TrainingSessionService) {

    this.auth.handleAuthentication().subscribe(user => {
      this.selectVariant(user.variants[0]);
    }, error => {});
  }

  selectVariant(variant: Variant) {
    this.variant = variant;
    this.trainingSess.reset();
    this.trainingSess.variant = variant;
  }

  ngAfterViewInit() {
    this.chessboards.changes.subscribe(chessboards => {
      if (chessboards.first) {
        this.trainingSess.setConfig(chessboards.first);
      }
    });
  }

}
