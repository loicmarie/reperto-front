import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VariantService } from './variant.service';
import { ChessSettings } from './chess.settings';
import { Variant } from './variant';
import { TrainingSessionVariant } from './training-session-variant';
import { Move } from './move';
import { TrainingSessionMove } from './training-session-move';
import { ChessboardComponent } from './chessboard/chessboard.component';


@Injectable()
export class TrainingSessionService {

  startMove: Move = new Move('', '', '', '', '', ChessSettings.START_FEN);

  chessboard: ChessboardComponent;
  isSession: Boolean = false;
  isStopped: Boolean = true;
  variant: Variant;
  played: TrainingSessionVariant = new TrainingSessionVariant();
  moveAnalysis: Object;
  previousMove: Move;
  lastHumanMove: Move;
  solution: Move;
  discoverRate: number = 0;
  correctnessRate: number = 0;
  _lastMove: Move = this.startMove;
  _fen: string = this.startMove.nextFEN;

  constructor(private variantService: VariantService) {}

  setConfig(chessboard: ChessboardComponent) {
    this.chessboard = chessboard;
  }

  reset() {
    this.lastMove = this.startMove;
    this.isStopped = false;
    this.moveAnalysis = undefined;
    this.solution = undefined;
  }

  continue() {
    this.reset();
    if (this.isEnd()) {
      this.isStopped = true;
      return;
    }
    if (!this.variant.color)
      this.computeNextMove();
  }

  stop() {
    this.reset();
    this.isSession = false;
  }

  run() {
    this.played = new TrainingSessionVariant();
    this.played.color = this.variant.color;

    this.isSession = true;
    this.isStopped = false;

    if (this.isEnd()) {
      this.isStopped = true;
      return;
    }

    if (this.isSession) {
      if (!this.variant.color) {
        this.computeNextMove();
      }
    } else {
      this.lastMove = this.startMove;
    }
  }

  isEnd() {
    return Object.keys(this.variant.nodes).length == 1
      || Object.keys(this.variant.nodes[this._fen]).length == 0;
  }

  isError(move: Move) {
    return !this.variant.nodes.hasOwnProperty(move.nextFEN);
  }

  computeNextMove() {
    let moves = Object.keys(this.variant.nodes[this._lastMove.nextFEN]);
    let moveNot = moves[Math.floor(Math.random()*moves.length)];
    let moveObj = this.variant.nodes[this._lastMove.nextFEN][moveNot];
    this.previousMove = this._lastMove;
    let move: Move = Move.fromObject(moveObj);
    this.lastMove = move;
    // if (this.isEnd())
    //   this.continue();
  }

  humanPlayed(move: Move) {
    // if (this.isEnd()) {
    //   this.lastHumanMove = move;
    //   this.lastMove = move;
    //
    //   this.isStopped = true;
    //   this.updateDiscoverRate();
    //   this.updateCorrectnessRate();
    //   return;
    // }
    this.analyzeMove(move);
    if (this.moveAnalysis['isError']) {
      this.lastHumanMove = move;

      this.handleVariantError(move);
      // let moveObj = this.variant.nodes[this._lastMove.previousFEN][this._lastMove.uciNotation];
      if (this.variant.nodes[this._lastMove.previousFEN][this._lastMove.uciNotation].hasOwnProperty('analysis'))
        this.variant.nodes[this._lastMove.previousFEN][this._lastMove.uciNotation]['analysis']['nbVisits']++;
      else
        this.variant.nodes[this._lastMove.previousFEN][this._lastMove.uciNotation]['analysis'] = {
          'nbVisits': 1,
          'nbSuccess': 0
        };
    } else {
      // let moveObj = this.variant.nodes[move.previousFEN][move.uciNotation];
      this.lastMove = Move.fromObject(this.variant.nodes[move.previousFEN][move.uciNotation]);

      if (this.variant.nodes[move.previousFEN][move.uciNotation].hasOwnProperty('analysis')) {
        this.variant.nodes[move.previousFEN][move.uciNotation]['analysis']['nbVisits']++;
        this.variant.nodes[move.previousFEN][move.uciNotation]['analysis']['nbSuccess']++;
      } else
        this.variant.nodes[move.previousFEN][move.uciNotation]['analysis'] = {
          'nbVisits': 1,
          'nbSuccess': 1
        };
      this.lastHumanMove = this.lastMove;
      if (this.isEnd()) {
        this.isStopped = true;
        this.updateDiscoverRate();
        this.updateCorrectnessRate();
        return;
      }
      this.computeNextMove();
    }
    this.updateDiscoverRate();
    this.updateCorrectnessRate();

    if (this.isEnd()) {
      this.isStopped = true;
      return;
    }
  }

  analyzeMove(move: Move) {
    this.moveAnalysis = {
      'isError': this.isError(move),
      'played': move.fromToNotation
      // 'moves': Object.keys(this.variant.nodes[this._lastMove.previousFEN])
    };
  }

  handleVariantError(move: Move) {
    this.computeNextMove();
    this.solution = this.lastMove;
    this.isStopped = true;
  }

  isHumanToPlay(): Boolean {
    return this.chessboard.colorToPlay == this.variant.color;
  }

  set lastMove(value: Move) {
    this.previousMove = this._lastMove;
    this._lastMove = value;
    this.fen = value.nextFEN;
    if (this.isSession && !this.isStopped) {
      this.played.addMove(value);
    }
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

  updateDiscoverRate() {
    let visited = [];
    let nbDiscovered = 0,
        nbTotal = 0;
    for (let variantFEN in this.variant.nodes) {
      for (let moveUCI in this.variant.nodes[variantFEN]) {
        if (this.variant.nodes[variantFEN][moveUCI].hasOwnProperty('analysis'))
          nbDiscovered++;
        nbTotal++;
      }
    }
    this.discoverRate = nbTotal == 0 ? 1 : nbDiscovered/nbTotal;
  }

  updateCorrectnessRate() {
    let visited = [];
    let nbDiscovered = 0,
        nbTotal = 0;
    for (let variantFEN in this.variant.nodes) {
      for (let moveUCI in this.variant.nodes[variantFEN]) {
        if (this.variant.nodes[variantFEN][moveUCI].hasOwnProperty('analysis'))
          nbDiscovered += this.variant.nodes[variantFEN][moveUCI]['analysis']['nbSuccess']
            / this.variant.nodes[variantFEN][moveUCI]['analysis']['nbVisits'];
        nbTotal++;
      }
    }
    this.correctnessRate = nbTotal == 0 ? 1 : nbDiscovered/nbTotal;
  }

}
