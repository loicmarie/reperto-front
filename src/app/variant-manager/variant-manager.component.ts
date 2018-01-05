import { Component, OnInit, Input } from '@angular/core';
import { ChessSettings } from '../chess.settings';
import { User } from '../user';
import { Move } from '../move';
import { Variant } from '../variant';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { VariantService } from '../variant.service';


import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-variant-manager',
  templateUrl: './variant-manager.component.html',
  styleUrls: ['./variant-manager.component.css']
})
export class VariantManagerComponent implements OnInit {

    startFEN: string = ChessSettings.START_FEN;
    startMove: Move = new Move('', '', '', '', '', '', ChessSettings.START_FEN);

    variants: Variant[];
    variant: Variant;
    fen: string = ChessSettings.START_FEN;

    _colorFilter: string = 'all';
    _nameFilter: string = '';
    _activeMove: Move = this.startMove;

    isSaving: Boolean = false;
    isAdding: Boolean = false;
    isDeleting: Boolean = false;

    constructor(private userService: UserService,
      private auth: AuthService,
      private variantService: VariantService) {

      this.auth.handleAuthentication().subscribe(user => {
        this.listVariants();
      }, error => {});
    }

    set activeMove(value: Move) {
      this._activeMove = value;
      this.fen = this._activeMove.nextFEN;
    }

    get activeMove(): Move {
      return this._activeMove;
    }

    set colorFilter(value: string) {
      this._colorFilter = value;
      this.listVariants();
    }

    get colorFilter(): string {
      return this._colorFilter;
    }

    set nameFilter(value: string) {
      this._nameFilter = value;
      this.listVariants();
    }

    get nameFilter(): string {
      return this._nameFilter;
    }

    setActiveMove(move: Move) {
      this.activeMove = move;
    }

    listVariants() {
      this.filterVariants();
      if (this.variants.length != 0)
        this.variant = this.variants[0];
    }

    selectVariant(variant: Variant) {
      this.variant = variant;
      // this.fen = ChessSettings.START_FEN;
      console.log('new active move:', this.startMove);
      this.activeMove = this.startMove;
    }

    addVariant() {
      this.variantService.new().subscribe(variant => {
        this.auth.user.variants.push(variant);
        this.userService.update(this.auth.user).subscribe(() => {
          this.listVariants();
        });
      });
    }

    deleteVariant() {
      this.isDeleting = true;
      this.variantService.delete(this.variant).subscribe(() => {
        this.auth.user.variants.splice(this.auth.user.variants.indexOf(this.variant),1);
        this.userService.update(this.auth.user).subscribe(() => {
          this.listVariants()
          setTimeout(() => {
            this.isDeleting = false;
          }, 500);
        });
      });
    }

    updateVariant() {
      this.isSaving = true;
      this.variantService.update(this.variant).subscribe(() =>
        setTimeout(() => {
          this.isSaving = false
        }, 500)
      );
    }

    isNewMove(move: Move) {
      console.log('IS NEW', !this.variant.nodes[move.previousFEN].hasOwnProperty(move.uciNotation));
      return !this.variant.nodes[move.previousFEN].hasOwnProperty(move.uciNotation);
    }


    deleteMove() {
      this.variant.deleteMove(this.activeMove);
      this.setPreviousMove();
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
        this.activeMove = Move.fromObject(moves[0]);
    }

    // EVENTS

    handleMovePlayed(move: Move) {
      this.setActiveMove(move);
      console.log(this.variant);
      if (this.isNewMove(move))
        this.variant.addMove(move);
    }

    filterVariants() {
      if (this._colorFilter == 'all')
        this.variants = this.auth.user.variants;
      else if (this._colorFilter == 'white')
        this.variants = this.auth.user.variants.filter(variant => variant.color == true);
      else
        this.variants = this.auth.user.variants.filter(variant => variant.color == false);
      this.variants = this.variants.filter(variant => variant.name.toLowerCase().indexOf(this._nameFilter.toLowerCase()) !== -1);
    }

    // HOOKS

    ngOnInit() {
    }

}
