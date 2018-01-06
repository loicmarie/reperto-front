import { Variant } from './variant';

export class Repertoire {
  _id: string;
  name: string;
  color: Boolean;
  variants: Variant[];

  constructor(_id: string = '', name: string = 'New repertoire', color: Boolean = true, variants: Variant[] = []) {

    this._id = _id;
    this.name = name;
    this.color = color;
    this.variants = variants;
  }

  hasVariant(variant: Variant) {
    for (let v of this.variants)
      if (v._id == variant._id)
        return true;
    return false;
  }

  addVariant(variant: Variant) {
    this.variants.push(variant);
  }

  removeVariant(variant: Variant) {
    for (let i = 0; i < this.variants.length; i++) {
      if (this.variants[i]._id == variant._id) {
        this.variants.splice(i, 1);
        return;
      }
    }
  }

  getSingleVariant(): Variant {
    let variant: Variant = new Variant(this._id + '_rep', this.name);
    variant.color = this.color;
    for (let v of this.variants)
      variant.nodes = $.extend(true, variant.nodes, v.nodes);
    return variant;
  }

  toDB(): Object {
    return {
      '_id': this._id,
      'name': this.name,
      'color': this.color,
      'variants': this.variants.map(variant => variant._id)
    }
  }

  static fromObject(repObj: Object): Repertoire {
    return new Repertoire(
      repObj['_id'],
      repObj['name'],
      repObj['color'],
      repObj['variants'].map(variantObj => Variant.fromObject(variantObj))
    );
  }
}
