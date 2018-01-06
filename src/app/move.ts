export class Move {
  from: string;
  to: string;
  san: string;
  color: Boolean;
  comment: string;
  promotion: string;
  previousFEN: string;
  nextFEN: string;

  // not persistent
  analysis: Object;

  constructor(from: string, to: string, san: string, color: Boolean, comment: string = '', promotion: string = '',
    previousFEN: string = '', nextFEN: string = '') {

    this.from = from;
    this.to = to;
    this.san = san;
    console.log('san', san, 'color', color);
    this.color = color;
    this.comment = comment;
    this.promotion = promotion;
    this.previousFEN = previousFEN;
    this.nextFEN = nextFEN;
  }

  get fromToNotation(): string {
    return this.from + '-' + this.to;
  }

  get uciNotation() : string {
    return this.from + this.to;
  }

  toObject(): Object {
    return {
      'from': this.from,
      'to': this.to,
      'san': this.san,
      'color': this.color,
      'comment': this.comment,
      'promotion': this.promotion,
      'previousFEN': this.previousFEN,
      'nextFEN': this.nextFEN
    };
  }

  static fromObject(move: Object): Move {
    return new Move(
      move['from'],
      move['to'],
      move['san'],
      move['color'],
      move['comment'],
      move['promotion'],
      move['previousFEN'],
      move['nextFEN']
    );
  }
}
