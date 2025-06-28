import React, {useState, useEffect} from "react";
import './App.css';
import { createAccount,
  getAllAccounts
 } from "./services/api";

function App() {
const [accountId, setAccountId] = useState('');
const [depositAmount, setDepositAmount] = useState('');
const [transferSourceId, setTransferSourceId] = useState('');
const [transferTargetId, setTransferTargetId] = useState('');
const [transferAmount, setTransferAmount] = useState('');
const [checkBalanceId, setCheckBalanceId] = useState('');
const [topSpendersN, setTopSpendersN] = useState(5);
const [message, setMessage] = useState('');
const [accounts, setAccounts] = useState([]);
const [topSpendersList, setTopSpendersList] = useState([]);
const [accountDetails, setAccountDetails] = useState(null);
const [queriedBalance, setQueriedBalance] = useState(null);


// Function to refresh all accounts (useful after create/deposit/transfer)
const fetchAllAccounts = async () => {
  try {
    const response = await getAllAccounts();
    if(response && Array.isArray(response)) {
      setAccounts(response);
    }else{
      setMessage('Failed to fetch all accounts: ' + JSON.stringify(response));
    }
  } catch (error) {
    setMessage(`Error fetching accounts: ${error.message}`);
  }
};

// Fetch all accounts on component mount
useEffect(() => {
    fetchAllAccounts();
  }, []); 

const handleCreateAccount = async () => {
  setMessage('');
  try {
    const response = await createAccount(accountId);
    setMessage(response.message || 'Account creation success!');
    setAccountId(''); // Clear the input field after successful creation
  } catch (error) {
    setMessage(`Error creating account: ${error.message}`);
  }
};

return (
  <div className="App">
      <header className="App-header">
        <h1>Banking System Frontend</h1>
        {message && <div className="message">{message}</div>}
      </header>

      <div className="container">
        <section className="card">
          <h2>Create Account</h2>
          <input
            type="text"
            placeholder="Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
          <button onClick={handleCreateAccount}>Create Account</button>
        </section>

        <section className="card">
          <h2>Deposit Money</h2>
          <input
            type="text"
            placeholder="Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          {/* <button onClick={handleDeposit}>Deposit</button> */}
        </section>

        <section className="card">
          <h2>Transfer Money</h2>
          <input
            type="text"
            placeholder="Source Account ID"
            value={transferSourceId}
            onChange={(e) => setTransferSourceId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Target Account ID"
            value={transferTargetId}
            onChange={(e) => setTransferTargetId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          {/* <button onClick={handleTransfer}>Transfer</button> */}
        </section>

        <section className="card">
          <h2>Account Details / Check Balance</h2>
          <input
            type="text"
            placeholder="Account ID"
            value={checkBalanceId}
            onChange={(e) => setCheckBalanceId(e.target.value)}
          />
          {/* <button onClick={handleGetAccountById}>Get Details</button>
          <button onClick={handleCheckBalance}>Check Balance</button> */}
          {accountDetails && (
            <div className="details">
              <h3>Details for {accountDetails.id}</h3>
              <p>Balance: ${accountDetails.balance}</p>
              <p>Outgoing: ${accountDetails.totalOutgoing}</p>
              <p>Created: {new Date(accountDetails.creationTimestamp * 1000).toLocaleDateString()}</p>
            </div>
          )}
          {queriedBalance !== null && (
            <div className="details">
              <h3>Balance for {checkBalanceId}: ${queriedBalance}</h3>
            </div>
          )}
        </section>

        <section className="card">
          <h2>Top Spenders</h2>
          <input
            type="number"
            placeholder="Number of top spenders (N)"
            value={topSpendersN}
            onChange={(e) => setTopSpendersN(e.target.value)}
          />
          {/* <button onClick={handleGetTopSpenders}>Get Top Spenders</button> */}
          {topSpendersList.length > 0 && (
            <div className="details">
              <h3>Top {topSpendersN} Spenders:</h3>
              <ul>
                {topSpendersList.map((spender) => (
                  <li key={spender.accountId}>
                    {spender.accountId}: ${spender.totalOutgoing}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="card full-width">
          <h2>All Accounts</h2>
          <button onClick={fetchAllAccounts}>Refresh All Accounts</button>
          {accounts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Account ID</th>
                  <th>Balance</th>
                  <th>Outgoing</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.accountId}>
                    <td>{acc.accountId}</td>
                    <td>${acc.balance}</td>
                    <td>${acc.totalOutgoing}</td>
                    <td>{new Date(acc.timeStamp * 1000).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No accounts found.</p>
          )}
        </section>
      </div>
    </div>
);
}
export default App;