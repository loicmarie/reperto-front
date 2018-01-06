import { Variant } from './variant';
import { Repertoire } from './repertoire';

export class User {
  _id: string;
  name: string;
  nickname: string;
  userId: string;
  variants: Variant[];
  repertoires: Repertoire[];

  constructor(_id: string, name: string, nickname: string, userId: string, variants: Variant[], repertoires: Repertoire[]) {
    this._id = _id;
    this.name = name;
    this.nickname = nickname;
    this.userId = userId;
    this.variants = variants;
    this.repertoires = repertoires;
  }

  toDB(): Object {
    return {
      '_id': this._id,
      'name': this.name,
      'nickname': this.nickname,
      'userId': this.userId,
      'variants': this.variants.map(variant => variant._id),
      'repertoires': this.repertoires.map(repertoire => repertoire._id)
    }
  }

  static fromObject(userObj: Object) : User {
    return new User(
      userObj['_id'],
      userObj['name'],
      userObj['nickname'],
      userObj['userId'],
      userObj['variants'].map(variantObj => Variant.fromObject(variantObj)),
      userObj['repertoires'].map(repertoireObj => Repertoire.fromObject(repertoireObj))
    );
  }
}
