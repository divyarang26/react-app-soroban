import './App.css';
import Vault_req from './Component/Vault_req/Vault_req';
import Header from './Component/Header';
import Deposit from './Component/Deposit/Deposit';
import Borrow from './Component/Borrow/Borrow';
import Repay from './Component/Repay/Repay';
import Withdraw from './Component/Withdraw/Withdraw';
import Wallet from './Component/Wallet/Wallet';
import '../src/Component/Hello.css';
import Hello from './Component/Hello';

function App() {
  return (
    <div>
      <Wallet />
      <div style={{ display: 'flex',justifyContent:'center' }}>
        <div >
          <Hello/>
          {/* <Vault_req /> */}
        </div>
        {/* <div className='container'>
          <Deposit></Deposit>
        </div> */}
      </div>
      {/* <div style={{ display: 'flex' }}>
        <div className='container'>
          <Borrow></Borrow>
        </div>
        <div className='container'>
          <Repay></Repay>
        </div>
        <div className='container'>
          <Withdraw></Withdraw>
        </div>
      </div> */}
    </div>
  );
}

export default App;
