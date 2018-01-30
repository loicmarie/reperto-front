import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VariantService } from './variant.service';
import { ChessSettings } from './chess.settings';
import { Variant } from './variant';
import { Move } from './move';
import { ChessboardComponent } from './chessboard/chessboard.component';


@Injectable()
export class TrainingSessionService {

  startMove: Move = new Move('', '', '', true, '', '', '', ChessSettings.START_FEN);

  chessboard: ChessboardComponent;
  isSession: Boolean = false;
  isStopped: Boolean = true;
  variant: Variant;
  // played: Variant = new Variant();
  moveAnalysis: Object;
  previousMove: Move;
  lastHumanMove: Move;
  solution: Move;
  discoverRate: number = 0;
  correctnessRate: number = 0;
  movesHist: Move[] = [];
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
    this.discoverRate = 0;
    this.correctnessRate = 0;
  }

  run() {
    // this.played = new Variant();
    // this.played.color = this.variant.color;

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
    let movesIds = Object.keys(this.variant.nodes[this._lastMove.nextFEN]);
    let minMoveId, minSuccessRate = 2;
    console.log('MOVES PROBAS', movesIds);
    if (!this.isHumanToPlay()) {
      for (let mId of movesIds) {
        let m = this.variant.nodes[this._lastMove.nextFEN][mId];
        console.log('move', m);
        let successRate = -9999;
        if (m.hasOwnProperty('analysis') && this._lastMove != this.startMove) {
          let father = this.variant.nodes[this._lastMove.previousFEN][this._lastMove.uciNotation];
          console.log('update FATHER', father);
          let fatherVisits = father.hasOwnProperty('analysis') ? father['analysis']['nbVisits'] : 1;
          console.log('rate', m['analysis']['nbSuccess'], m['analysis']['nbVisits'], fatherVisits);
          successRate = m['analysis']['nbSuccess'] / m['analysis']['nbVisits'];
            // - Math.sqrt( 2 * Math.log( fatherVisits / m['analysis']['nbVisits'] ));
        }
        console.log('TEST', successRate, minSuccessRate);
        if (successRate < minSuccessRate) {
          console.log('INF', successRate, minSuccessRate);
          minSuccessRate = successRate;
          minMoveId = mId;
        }
      }
    } else {
      minMoveId = movesIds[Math.floor(Math.random() * movesIds.length)]
    }
    console.log('minMoveId', minMoveId);
    // let moveNot = movesIds[Math.floor(Math.random()*movesIds.length)];
    let moveObj = this.variant.nodes[this._lastMove.nextFEN][minMoveId];
    this.previousMove = this._lastMove;
    let move: Move = Move.fromObject(moveObj);
    this.lastMove = move;
  }

  addSuccess(move: Move) {
      if (this.variant.nodes[move.previousFEN][move.uciNotation].hasOwnProperty('analysis')) {
        this.variant.nodes[move.previousFEN][move.uciNotation]['analysis']['nbVisits']++;
        this.variant.nodes[move.previousFEN][move.uciNotation]['analysis']['nbSuccess']++;
      } else
        this.variant.nodes[move.previousFEN][move.uciNotation]['analysis'] = {
          'nbVisits': 1,
          'nbSuccess': 1
        };
  }

  addFailure(move: Move) {
    let i = 1;
    for (let m of this.movesHist) {
      if (this.variant.nodes[m.previousFEN][m.uciNotation].hasOwnProperty('analysis'))
        this.variant.nodes[m.previousFEN][m.uciNotation]['analysis']['nbSuccess'] = Math.max(0, this.variant.nodes[m.previousFEN][m.uciNotation]['analysis']['nbSuccess']-i/this.movesHist.length);
      else
        this.variant.nodes[m.previousFEN][m.uciNotation]['analysis'] = {
          'nbVisits': 1,
          'nbSuccess': 0
        };
      i++;
    }
  }

  humanPlayed(move: Move) {
    this.analyzeMove(move);
    if (this.moveAnalysis['isError']) {
      this.lastHumanMove = move;
      this.movesHist.push(this._lastMove);

      // if (this._lastMove != this.startMove)
      //   this.addFailure(this._lastMove);

      this.handleVariantError(move);
      // let moveObj = this.variant.nodes[this._lastMove.previousFEN][this._lastMove.uciNotation];
      this.addFailure(this._lastMove);
      this.movesHist = [];

    } else {
      // let moveObj = this.variant.nodes[move.previousFEN][move.uciNotation];

      this.movesHist.push(this._lastMove);
      if (this._lastMove != this.startMove)
        this.addSuccess(this._lastMove);

      this.lastMove = Move.fromObject(this.variant.nodes[move.previousFEN][move.uciNotation]);

      this.addSuccess(move);

      this.lastHumanMove = this.lastMove;
      if (this.isEnd()) {
        this.movesHist = [];
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
      this.movesHist = [];
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
        if (this.variant.nodes[variantFEN][moveUCI]['color'] == this.variant.color) {
          if (this.variant.nodes[variantFEN][moveUCI].hasOwnProperty('analysis'))
            nbDiscovered++;
          nbTotal++;
        }
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
        if (this.variant.nodes[variantFEN][moveUCI]['color'] == this.variant.color) {
          if (this.variant.nodes[variantFEN][moveUCI].hasOwnProperty('analysis'))
            nbDiscovered += this.variant.nodes[variantFEN][moveUCI]['analysis']['nbSuccess']
              / this.variant.nodes[variantFEN][moveUCI]['analysis']['nbVisits'];
          nbTotal++;
        }
      }
    }
    this.correctnessRate = nbTotal == 0 ? 1 : nbDiscovered/nbTotal;
  }

}
