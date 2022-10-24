import "./App.css";
import React, { useEffect, useState } from "react";
import web3 from "./web3.js";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('0');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');
  async function init() {
    const manager = await lottery.methods.manager().call();
    setManager(manager);
    const players = await lottery.methods.getPlayers().call();
    setPlayers(players);
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
  }
  useEffect(() => {
    init();
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...')
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    })
    setMessage('You have been entered!')
  }
  async function handlePickUpWinner() {
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...')
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setMessage('A winner has been picked!')
  }
  return (
    <div className="app">
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>There are currently {players.length} people entered, competing to
        win {web3.utils.fromWei(balance, 'ether')} ether
      </p>

      <hr />

      <form onSubmit={handleSubmit}>
        <h4>Want to try your lock?</h4>
        <div>
          <label htmlFor="">Amount of ether to enter</label>
          <input type="text" value={value} onChange={e => setValue(e.target.value)} />
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={handlePickUpWinner}>Pick a winner!</button>

      <hr />
      <h1>{message}</h1>

    </div>
  );
}

export default App;
