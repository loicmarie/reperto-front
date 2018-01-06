import { Component, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { AuthService } from '../auth.service';
import { ChessSettings } from '../chess.settings';
import { Move } from '../move';
import { Variant } from '../variant';
import { VariantService } from '../variant.service';
import { Repertoire } from '../repertoire';
import { RepertoireService } from '../repertoire.service';
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
    private repertoireService: RepertoireService,
    private trainingSess: TrainingSessionService) {

    this.auth.handleAuthentication().subscribe(user => {
      this.selectVariant(user.variants[0]);
    }, error => {});
  }

  selectVariant(variant: Variant) {
    this.variant = variant;
    this.trainingSess.stop();
    this.trainingSess.variant = variant;
  }

  selectRepertoire(repertoire: Repertoire) {
    this.selectVariant(repertoire.getSingleVariant());
  }

  ngAfterViewInit() {
    this.chessboards.changes.subscribe(chessboards => {
      if (chessboards.first) {
        this.trainingSess.setConfig(chessboards.first);
      }
    });
  }

}
