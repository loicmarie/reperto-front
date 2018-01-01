export class Move {
  from: string;
  to: string;
  comment: string;
  promotion: string;
  previousFEN: string;
  nextFEN: string;

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
}
