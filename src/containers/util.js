
import _ from 'lodash'

export function parseProductProperties(product) {
  const {name, variants, price:_price} = product;
  let price = _price,
      variantIds = [];
  if ( typeof _price === 'undefined' || _price === null) {
    variantIds = _.keys(variants);
    if (variantIds.length > 1) {
      // tar fram type=min/max i variant objektet
      const ext = type => _.at(variants, _[type + 'By'](variantIds, id=>variants[id].price) + ".price")
      // pris ansätts till min_pris - max_pris
      price = `${ext('min')} - ${ext('max')}`;
    } else {
      if ( variantIds.length ) {
        price = variants[variantIds[0]].price
      } else {
        // om price inte finns och variantsIds.length = 0 så måste price sättas till 0;
        price = 0;
      }
    }
  }

  return {
    name,
    price, 
    variants,
    variantIds
  }
}