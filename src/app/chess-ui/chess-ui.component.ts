import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Move } from '../move';
import { Variant } from '../variant';

@Component({
  selector: 'app-chess-ui',
  templateUrl: './chess-ui.component.html',
  styleUrls: ['./chess-ui.component.css']
})
export class ChessUiComponent implements OnInit {

  @Input() variant: Variant;
  @Output() movePlayed = new EventEmitter<Move>();

  fen: string;

  constructor() { }

  handleMovePlayed(move: Move) {
    this.movePlayed.emit(move);
  }

  ngOnInit() {
  }

}
