import React, { Component } from 'react';

class CoinMenu extends Component {


    render() {
      // let coinName = coinName = this.props.cryptos && this.props.cryptos[this.props.cryptoValue] && this.props.cryptos[this.props.cryptoValue].name

      return (
        <div>
          {/* {JSON.stringify(this.props.props.cryptos[1])} */}
          <select
            value={this.props.cryptoValue} 
            onChange={this.props.onCryptoChange} 
            className="form-control" id="coinDropdown">
            <option value="1">Bitcoin</option>
            <option value="2">Litecoin</option>
            <option value="52">Ripple</option>
            <option value="512">Stellar</option>
            <option value="825">Tether</option>
            <option value="1027">Ethereum</option>
            <option value="1720">IOTA</option>
            <option value="1765">EOS</option>
            <option value="1831">Bitcoin Cash</option>
            <option value="2010">Cardano</option>
          </select>
        </div>
      );
    };
  };

  export default CoinMenu