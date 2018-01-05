import { Move } from './move';

export class Variant {
  _id: string;
  name: string;
  nodes: Object;
  color: Boolean;
  tabia: string;

  constructor(_id: string = '', name: string = 'New variant',
    nodes: Object = {'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': {}},
    color: Boolean = true, tabia: string = '') {

    this._id = _id;
    this.name = name;
    this.nodes = nodes;
    this.color = color;
    this.tabia = tabia;
  }

  addMove(move: Move) {
    let extanded = {
      [move.previousFEN]: {
        [move.uciNotation]: move.toObject()
      },
      [move.nextFEN]: {}
    };
    // if (!this.nodes.hasOwnProperty(move.nextFEN))
    this.nodes = $.extend(true, extanded, this.nodes);
  }

  deleteMove(move: Move) {
    for (let nextMoveUCI in this.nodes[move.nextFEN]) {
      this.deleteMove(Move.fromObject(this.nodes[move.nextFEN][nextMoveUCI]));
      if (Object.keys(this.nodes[move.nextFEN]).length == 0)
        delete this.nodes[move.nextFEN];
    }
    delete this.nodes[move.previousFEN][move.uciNotation];
    this.nodes = $.extend(true, {}, this.nodes);
  }

  static fromObject(variantObj: Object): Variant {
    return new Variant(
      variantObj['_id'],
      variantObj['name'],
      variantObj['nodes'],
      variantObj['color'],
      variantObj['tabia']
    );
  }
}
