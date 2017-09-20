import React from 'react';
import _ from 'lodash';
import {
  Table
} from 'reactstrap';
import {
  If,
  Icon,
  Loading,
  PassIdButton
} from './components';
import * as util from './util';


/*  
    Databasen har följande struktur: (se nedan)
    Förklaring:
      användarid `userid1337` har produkter med ids: `prodid1`, `prodid2`, `prodid3`.

    Hela denna komponent parsar och renderar sån här data till en tabell.
    (ps: egentligen är alla genererade ids UUIDs)
{
  "products": {
    "userid1337" : {
      "prodid1" : {
        "name" : "computer",
        "variants" : {
          "1c1901de-7109-4878-b316-8f0db8521c5e" : {
            "name" : "green",
            "price" : 500
          },
          "7410e258-884c-4ce2-a28f-cbcca72a8b8d" : {
            "name" : "blue",
            "price" : 1000
          }
        }
      },
      "prodid2" : {
        "name" : "ipod",
        "price" : 123
      },
      "prodid3" : {
        "name" : "flower",
        "price" : 500
      }
    }
  }
}
          */
export default class ProductTableComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expand: false
    };
    _.bindAll(this, 'expand', 'edit');
  }
  expand(id) {
    this.setState({
      expand: id === this.state.expand ? false : id
    });
  }
  edit(id) {
    this.props.onEdit(id);
  }
  render() {
    const prods = this.props.prods;
    if ( ! prods ) return null;
    return (
      <Table className="product-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>VARIANT</th>
            <th>PRICE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {_.flatten(_.keys(prods).map(id => {

            const { name, variants, price, variantIds } = util.parseProductProperties(prods[id]);

            const rows = [
              (<tr key={id} className={prods[id].status && prods[id].status.state === 'uploading' && prods[id].status.operation === 'delete' && 'disabled'}>
                <td>
                  <If case={prods[id].status && prods[id].status.state === 'uploading'} el="span">
                    <Loading />{" "}
                  </If>
                  {name}
                </td>
                <td>
                  <If case={variantIds.length}>
                    {variantIds.length}
                    <PassIdButton className='seamless' onClick={this.expand} id={id}>{Icon('angle-' + (this.state.expand === id ? 'up' : 'down'))}</PassIdButton>
                  </If>
                </td>
                <td>{price} €</td>
                <td><PassIdButton color="link" className='seamless' onClick={this.edit} id={id}>Edit</PassIdButton></td>
              </tr>)
            ];


            if (this.state.expand === id && variantIds) {
              variantIds.forEach(variantId => {
                rows.push(
                  <tr key={id + '-variant-details-' + variantId} className="sub-row">
                    <td></td>
                    <td>{variants[variantId].name}</td>
                    <td>{variants[variantId].price} €</td>
                    <td></td>
                  </tr>
                );
              });
            }
            
            return rows;
 
          }))}
        </tbody>
      </Table>
    );
  }
}