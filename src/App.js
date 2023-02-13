import logo from './logo.svg';
import './App.css';
import Hello from './Component/Hello';
import Vault_req from './Component/Vault_req/Vault_req';
import Header from './Component/Header';
import Deposit from './Component/Deposit/Deposit';
import Borrow from './Component/Borrow/Borrow';
import Repay from './Component/Repay/Repay';
import Withdraw from './Component/Withdraw/Withdraw';


function App() {
  return (
    <div >
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

      </header> */}
      <Header />
      <div style={{ display: "flex" }}>
        <div className='container'>
          {/* <Hello /> */}
        </div>
        <div className='container'>
          <Vault_req />
        </div>
        <div className='container'>
          <Deposit></Deposit>
        </div>
        
      </div>
      <div style={{ display: "flex" }}>
      <div className='container'>
          <Borrow></Borrow>
        </div>
        <div className='container'>
          <Repay></Repay>
        </div>
        <div className='container'>
          <Withdraw></Withdraw>
        </div>
      </div>
    </div>
  );
}

export default App;
