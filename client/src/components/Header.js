import React, { Component } from 'react';
import Transactions from "./Transactions"
import API from "../utils/API";

// Defines variable for use as CSS
var textStyle = {
  fontFamily: "Georgia"
};

let testWallet = {
  cash: 10000,
  BTC: 2503,
  ETH: 185
}

export default class Header extends Component {

  // Set initial state
  state = {
    cryptos: [],
    cryptoValue: 52,
    createEmail: 'Enter your email to create your account',
    loginEmail: "Enter your email to sign in here",
    users: [],
    signedIn: {},
    userWallet: {},
    transactionAmount: 1,
    transactionStatus: ''
  };


  // Runs the API query upon page load
  componentDidMount() {
    this.cryptoAPI();
    this.loadUsers();
  };


  // Grab the user list from the database
  loadUsers = () => {
    API.getUsers()
      .then(res => {
        console.log(res.data)
        this.setState({ users: res.data })
      })

      .catch(err => console.log(err));
  };


  // Runs the CoinMarketCap API and updates the state with the response
  cryptoAPI() {
    API.search()
      .then(
        res => {
          // Puts initial response (object of objects) into an array so we can check it's length for rendering (similar to users)
          this.setState({ cryptos: [res.data.data] })
        }
      )
      .catch(err => console.log(err));
  };

  // Update the crypto on the page
  onCryptoChange = e => {
    console.log("updating with " + e.target.value)
    this.setState({ cryptoValue: e.target.value })
    // console.log(this.state.cryptos[this.state.value])
  }


  // Updates state when the email the user enters to create an account is changed
  onEmailChange = e => {
    this.setState({ createEmail: e.target.value })
  }

  createUser = e => {
    e.preventDefault();
    API.createUser({
      userName: "test user",
      userEmail: this.state.createEmail,
      wallet: testWallet
    })
      .then(res => this.loadUsers)
      .catch(err => console.log(err));
  }


  // Updates state when the email the user enters to sign in is changed
  onLoginChange = e => {
    this.setState({ loginEmail: e.target.value })
  }

  userLogin = e => {
    e.preventDefault();
    API.userLogin(this.state.loginEmail)
      .then(res => {
        console.log("signed in")
        console.log(res.data)
        this.setState({
          signedIn: {
            userName: res.data.userName,
            userEmail: res.data.userEmail,
          },
          userWallet: res.data.wallet
        })
      })
      .catch(err => console.log(err))
  }


  onTransactionChange = e => {
    this.setState({ transactionAmount: e.target.value })
  }

  buyTransaction = e => {
    e.preventDefault();
    let wallet = this.state.userWallet;
    let coinSymbol = this.state.cryptos[0][this.state.cryptoValue].symbol;
    // let coinPrice = this.state.cryptos[0][this.state.cryptoValue].quotes.USD.price;

    // Checks if the user can afford the transaction
    if (this.state.transactionAmount > wallet.cash) {
      this.setState({ transactionStatus: "You cannot afford this transaction!" })
    }

    // Allows the transaction if the user can afford it
    else {
      wallet.cash -= this.state.transactionAmount

      // Checks to see if the coin is in the user's wallet (i.e. not undefined).  If not it sets the coin amount to the transactionAmount.  Otherwise, it adds it.
      if (!wallet[coinSymbol]) {
        wallet[coinSymbol] = Number(this.state.transactionAmount)
      }
      else { wallet[coinSymbol] += Number(this.state.transactionAmount) }

      // Updates the state of the wallet
      this.setState({ userWallet: wallet, transactionStatus: "Transaction complete!" })
    }
  }


  renderTransactions() {

    // Makes it so Transactions isn't rendered unless the user data is actually there.  So, basically, "Transactions" was 
    // rendering twice - once before the users were loaded and once afterwards.  However, when we'd try to call for specific  
    // properties of an object (and because of the timing of the user data being grabbed), it was trying to grab the property   
    // from the empty array.  So now, this makes it so that we won't even run that initial empty-array Transactions rendering 
    // because the if statement here ensures that it won't render unless there's an item in the array
    if (this.state.users.length && this.state.cryptos) {
      return (<Transactions
        cryptos={this.state.cryptos[0]}
        cryptoValue={this.state.cryptoValue}
        onCryptoChange={this.onCryptoChange}

        createEmail={this.state.createEmail}
        onEmailChange={this.onEmailChange}
        createUser={this.createUser}

        loginEmail={this.state.loginEmail}
        onLoginChange={this.onLoginChange}
        userLogin={this.userLogin}
        signedIn={this.state.signedIn}
        userWallet={this.state.userWallet}

        onTransactionChange={this.onTransactionChange}
        buyTransaction={this.buyTransaction}
        transactionAmount={this.state.transactionAmount}
        transactionStatus={this.state.transactionStatus}

        users={this.state.users}
      />)
    }
  }




  render() {

    // { console.log(this.state.cryptos) }
    return (

      <div className="container justify-content-center mt-3 header">
        <h1 className="text-center" style={textStyle}>Crypto Transactions</h1>

        <hr />

        {this.renderTransactions()}

      </div>
    )
  }
}