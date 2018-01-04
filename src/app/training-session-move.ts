import { Move } from './move';

export class TrainingSessionMove extends Move {
  nbVisits: number = 0;
  nbSuccess: number = 0;

  constructor(from: string, to: string, comment: string = '', promotion: string = '',
    previousFEN: string = '', nextFEN: string = '', nbVisits: number = 0, nbSuccess: number = 0) {

    super(from, to, comment, promotion, previousFEN, nextFEN);
    this.nbVisits = nbVisits;
    this.nbSuccess = nbSuccess;
  }

  get descr(): string {
    return this.nbSuccess + '/' + this.nbVisits;
  }

  static fromObject(moveObj: Object): TrainingSessionMove {
    return new TrainingSessionMove(
      moveObj['from'],
      moveObj['to'],
      moveObj['comment'],
      moveObj['promotion'],
      moveObj['previousFEN'],
      moveObj['nextFEN'],
      moveObj['nbVisits'],
      moveObj['nbSuccess']
    );
  }
}
