import { Component, OnInit, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { Move } from '../move';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit {

  @Output() movePlayed = new EventEmitter<Move>();
  @Output() fenChange = new EventEmitter<string>();

  game: any = new Chess();
  board: any;
  move: Move;

  private _flipped: boolean = false;
  private _fen: string = this.game.fen();

  constructor() { }

  @Input('flipped')
  set flipped(value: boolean) {
    if (value != this._flipped) {
      this._flipped = value;
      if (this.board) {
        this.board.flip();
      } else if (!this.board) {
      } else {
      }
    }
  }

  get flipped(): boolean {
    return this._flipped;
  }

  @Input('fen')
  set fen(value: string) {
    console.log('chessboard.set.fen', value);
    this._fen = value;
    // this.fenChange.emit(this._fen);
    if (this.board) {
      this.setPosition(this._fen);
    }
  }

  get fen(): string {
    return this._fen;
  }

  get colorToPlay(): Boolean {
    return this.game.turn() == 'w'
  }

  ngOnInit() {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
    if (this.board)
      this.board.resize(event);
  }



  // UTILS

  play(move: Move) {
    this.move = move;
    this.game.move({from: move.from, to: move.to});
    this.board.move(move.fromToNotation);
  }

  setPosition(fen: string) {
    this.board.position(fen, true);
    this.game.load(fen);
  }

  validateMove() {
    this.move.previousFEN = this._fen;
    this.move.nextFEN = this.game.fen();
    this._fen = this.move.nextFEN;
    this.movePlayed.emit(this.move);
  }

  greySquare(square: string) {
    let squareEl = $('#board .square-' + square);

    let background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
      background = '#696969';
    }

    squareEl.css('background', background);
  }

  removeGreySquares() {
    $('#board .square-55d63').css('background', '');
  }



  // EVENTS

  onDragStart(source: string, piece: string, position: Object, orientation: string): Boolean {
    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    if (this.game.game_over() === true ||
        (this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  }

  onDrop(source: string, target: string) {
    console.log('onDrop', source, target);
    this.removeGreySquares();

    // see if the move is legal
    let move = this.game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return 'snapback';
    this.move = new Move(source, target);
  }

  onMouseoverSquare(square: string, piece: string) {
    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    // highlight the square they moused over
    this.greySquare(square);

    // highlight the possible squares for this piece
    for (let i = 0; i < moves.length; i++) {
      this.greySquare(moves[i].to);
    }
  }

  onMouseoutSquare(square: string, piece: string) {
    this.removeGreySquares();
  }

  onSnapEnd() {
    console.log('SnapEnd');
    this.validateMove();
    this.board.position(this.game.fen());
  }

  onChange(oldState: string, newState: string) {
    // console.log('CHANGE but no move !');
    // if (this.move) {
    //   console.log('emit yolo');
    //   this.move.previousFEN = this._fen;
    //   console.log('fen from', this._fen, 'to', this.game.fen());
    //   this.move.nextFEN = this.game.fen(); // ChessBoard.objToFen(newState);
    //   this._fen = this.move.nextFEN;
    //   // this.fenChange.emit(this._fen);
    //   this.movePlayed.emit(this.move);
    //   this.move = undefined;
    // }
  }



  // HOOKS

  ngAfterViewInit() {

    let cfg = {
      draggable: true,
      position: 'start',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onMouseoutSquare: this.onMouseoutSquare.bind(this),
      onMouseoverSquare: this.onMouseoverSquare.bind(this),
      onChange: this.onChange.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this),
      orientation: this._flipped ? 'black' : 'white'
    };
    this.board = ChessBoard('board', cfg);
  }

}
