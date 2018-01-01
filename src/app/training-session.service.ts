import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VariantService } from './variant.service';
import { ChessSettings } from './chess.settings';
import { Variant } from './variant';
import { Move } from './move';
import { ChessboardComponent } from './chessboard/chessboard.component';


@Injectable()
export class TrainingSessionService {

  startMove: Move = new Move('', '', '', '', '', ChessSettings.START_FEN);

  chessboard: ChessboardComponent;
  isSession: Boolean = false;
  variant: Variant;
  moveAnalysis: Object;
  previousMove: Move;
  _lastMove: Move = this.startMove;
  _fen: string = this.startMove.nextFEN;

  constructor(private variantService: VariantService) {}

  setConfig(chessboard: ChessboardComponent) {
    this.chessboard = chessboard;
  }

  init() {
  }

  reset() {
    this.isSession = false;
    this.lastMove = this.startMove;
  }

  run() {
    this.isSession = true;
    if (this.isSession) {
      if (!this.variant.color)
        this.computeNextMove();
    } else {
      this.lastMove = this.startMove;
    }
  }

  isError() {
    return !this.variant.nodes.hasOwnProperty(this._lastMove.nextFEN);
  }

  computeNextMove() {
    console.log(this.variant.nodes);
    let moves = Object.keys(this.variant.nodes[this._lastMove.nextFEN]);
    let moveNot = moves[Math.floor(Math.random()*moves.length)];
    let moveObj = this.variant.nodes[this._lastMove.nextFEN][moveNot];
    this.previousMove = this._lastMove;
    let move = this.variantService.moveObjectToInstance(moveObj);
    // this.chessboard.play(move);
    this.lastMove = move;
  }

  humanPlayed(move: Move) {
    console.log('human', move);
    this.lastMove = move;
    setTimeout(() => {

      console.log('humantoplay:', this.isHumanToPlay());
      if (this.isSession && !this.isHumanToPlay()) {
        this.moveAnalysis = {
          'isError': this.isError(),
          'played': this._lastMove.fromToNotation,
          'moves': Object.keys(this.variant.nodes[this._lastMove.previousFEN])
        };
        if (this.moveAnalysis['isError']) {
          console.log('ERROR', this.chessboard.fen, this.fen, this.lastMove.nextFEN, this.previousMove.nextFEN);
          this.lastMove = new Move(
            '',
            '',
            '',
            '',
            '',
            this.previousMove.nextFEN
          );
          // rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2
          console.log('fen changed', this.fen, 'waited',
          'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR w KQkq -');
          // this.lastMove = new Move(
          //   this.previousMove.from, this.previousMove.to, '', '', this.previousMove.previousFEN, this.previousMove.nextFEN);
          // this.chessboard.setPosition(this.lastMove.nextFEN);
          setTimeout(() => {
            this.computeNextMove();
          }, 500);
        } else {
          console.log('computeNextMove');
          this.computeNextMove();
        }
      }
    }, 200);
  }

  isHumanToPlay(): Boolean {
    return this.chessboard.colorToPlay == this.variant.color;
  }

  showWaitedMove(from: string): Observable<void> {
    return new Observable<void>(observer => {
      console.log('UNDO', this.previousMove);
      this.lastMove = this.previousMove;
      observer.next();
      // this.chessboard.play(move);
      // setTimeout(() => {
      //   observer.next();
      //   // this.chessboard.play
      // }, 3000);
    });
  }

  set lastMove(value: Move) {
    this.previousMove = this._lastMove;
    this._lastMove = value;
    console.log('LAST', this.fen, value.nextFEN);
    this.fen = value.nextFEN;
    console.log('set.lastMove', this.previousMove, this._lastMove);
  }

  get lastMove(): Move {
    return this._lastMove;
  }

  set fen(value: string) {
    console.log('set fen', value);
    this._fen = value;
  }

  get fen(): string {
    return this._fen;
  }

  // set lastMove(value: Move) {
  //   if (value != this._lastMove) {
  //     this.previousMove = this._lastMove;
  //     this._lastMove = value;
  //     this.fen = this._lastMove.nextFEN;
  //     console.log('set new move', value, this.previousMove, this._lastMove);
  //     if (this.isSession && this.chessboard.colorToPlay != this.variant.color) {
  //       this.moveAnalysis = {
  //         'isError': this.isError(),
  //         'played': this._lastMove.fromToNotation,
  //         'moves': Object.keys(this.variant.nodes[this._lastMove.previousFEN])
  //       };
  //       if (this.moveAnalysis['isError']) {
  //         this.isSession = false;
  //         console.log('TEST', this.lastMove.nextFEN, this.previousMove.nextFEN);
  //         this.lastMove = this.previousMove;
  //         // this.showWaitedMove(this.moveAnalysis['moves']).subscribe(() => {
  //         //   // this.reset();
  //         // });
  //       } else
  //         this.computeNextMove();
  //     }
  //   }
  // }

}
