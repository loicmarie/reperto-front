export class Move {
  from: string;
  to: string;
  comment: string;
  promotion: string;
  previousFEN: string;
  nextFEN: string;

  // not persistent
  analysis: Object;
  //  = {
  //   'nbVisits': 0,
  //   'nbSuccess': 0
  // };

  constructor(from: string, to: string, comment: string = '', promotion: string = '', previousFEN: string = '', nextFEN: string = '') {
    this.from = from;
    this.to = to;
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
      move['comment'],
      move['promotion'],
      move['previousFEN'],
      move['nextFEN']
    );
  }
}
