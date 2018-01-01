import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChessSettings } from '../chess.settings';
import { Move } from '../move';
import { Variant } from '../variant';
import { VariantService } from '../variant.service';

@Component({
  selector: 'app-chess-notation-viewer',
  templateUrl: './chess-notation-viewer.component.html',
  styleUrls: ['./chess-notation-viewer.component.css']
})
export class ChessNotationViewerComponent implements OnInit {

  @Output() activeMoveChange: EventEmitter<Move> = new EventEmitter<Move>();
  @Input() variant: Variant;
  previousMove: Move;
  private _activeMove: Move;

  constructor(private variantService: VariantService) {}

  // GETTERS AND SETTERS

  @Input('activeMove')
  set activeMove(value: Move) {
    if (value != this._activeMove) {
      this.previousMove = $.extend(true, {}, this._activeMove);
      this._activeMove = value;
      console.log('WOUHOU', this.previousMove, this._activeMove);
      this.activeMoveChange.emit(this._activeMove);
    }
  }

  get activeMove(): Move {
    return this._activeMove;
  }

  get startFEN(): string {
    return ChessSettings.START_FEN;
  }

  // EVENTS

  setNextMove() {
    let nodes = this.variant.nodes;
    let moves = Object.keys(nodes[this._activeMove.nextFEN]);
    if (moves.length != 0)
      this.activeMove = this.variantService.moveObjectToInstance(nodes[this._activeMove.nextFEN][moves[0]]);
  }

  setPreviousMove() {
    let moves = [];
    for (let node in this.variant.nodes) {
      for (let move in this.variant.nodes[node]) {
        if (this.variant.nodes[node][move].nextFEN == this.activeMove.previousFEN)
          moves.push(this.variant.nodes[node][move]);
      }
    }
    if (moves.length != 0)
      this.activeMove = this.variantService.moveObjectToInstance(moves[0]);
  }

  ngOnInit() {
  }

}
