import React, { useState, useEffect } from "react";
import './App.css';
import {
  createAccount,
  getAllAccounts,
  getAccountById,
  deposit,
  transfer} from "./services/api";

function App() {
  const [accountId, setAccountId] = useState('');
  const [depositAccountId, setdepositAccountId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [transferSourceId, setTransferSourceId] = useState('');
  const [transferTargetId, setTransferTargetId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [checkBalanceId, setCheckBalanceId] = useState('');
  const [topSpendersN, setTopSpendersN] = useState('');
  const [message, setMessage] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [topSpendersList, setTopSpendersList] = useState([]);
  const [accountDetails, setAccountDetails] = useState(null);
  const [queriedBalance, setQueriedBalance] = useState(null);

  // Fetch all accounts on component mount
  useEffect(() => {
    console.log('App component mounted, fetching all accounts...');
    fetchAllAccounts();
  }, []);

  // Function to clear account details and messages
  const clearDetails = () => {
  setAccountDetails(null);
  setQueriedBalance(null);
  setCheckBalanceId('');
  setMessage('');
};

  // Function to refresh all accounts (useful after create/deposit/transfer)
  const fetchAllAccounts = async () => {
    try {
      const response = await getAllAccounts();
      console.log('Fetch all accounts response:', response);
      if (response && Array.isArray(response)) {
        setAccounts(response);
      } else {
        setMessage('Failed to fetch all accounts: ' + JSON.stringify(response));
      }
    } catch (error) {
      setMessage(`Error fetching accounts: ${error.message}`);
    }
  };

  // Function to create a new account
  const handleCreateAccount = async () => {
    clearDetails(); // Clears all relevant fields
    try {
      const response = await createAccount(accountId);
      setMessage(response.message || 'Account creation success!');
      setAccountId('');
      fetchAllAccounts();
    } catch (error) {
      setMessage(`Error creating account: ${error.message}`);
    }
  };

  // Function to get account details by ID
  const handleGetAccountById = async () => {
    clearDetails(); // Clears all relevant fields
    try {
      const response = await getAccountById(checkBalanceId);
      console.log('Get account by ID response:', response);
      if (response) {
        setAccountDetails(response);
        setMessage('Account details fetched successfully.');
        setCheckBalanceId(''); // Optionally clear input after fetching
      } else {
        setMessage('No account found with that ID');
        setCheckBalanceId('');
      }
    } catch (error) {
      setMessage(`Error fetching account details: ${error.message}`);
    }
  };

  // Function to check balance of an account
  const handleCheckBalance = async () => {
    clearDetails(); // Clears all relevant fields
    try {
      const response = await getAccountById(checkBalanceId);
      console.log('Check balance response:', response);
      if (response) {
        setQueriedBalance(response.balance);
        setMessage(`Balance for account ${checkBalanceId} is ₹${response.balance}`);
      } else {
        setMessage('No account found with that ID');
        setCheckBalanceId('');
      }
    } catch (error) {
      setMessage(`Error checking balance: ${error.message}`);
    }
  };

  // Function to handle deposit
  const handleDeposit = async () => {
    clearDetails(); // Clears all relevant fields
    try {
      const response = await deposit(depositAccountId, depositAmount);
      setMessage(response.message || 'Deposit successful! New balance: ₹' + response.newBalance);
      setdepositAccountId('');
      setDepositAmount('');
      fetchAllAccounts();
    } catch (error) {
      setMessage(`Error depositing money: ${error.message}`);
    }
  };

  // Function to handle transfer
  const handleTransfer = async () => {
    clearDetails(); // Clears all relevant fields
    try {
      const response = await transfer(transferSourceId, transferTargetId, transferAmount);
      setMessage(response.message || 'Transfer successful! New balance: ₹' + response.newBalance);
      setTransferSourceId('');
      setTransferTargetId('');
      setTransferAmount('');
      fetchAllAccounts();
    } catch (error) {
      setMessage(`Error transferring money: ${error.message}`);
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
            value={depositAccountId}
            onChange={(e) => setdepositAccountId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button onClick={handleDeposit}>Deposit</button>
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
          <button onClick={handleTransfer}>Transfer</button>
        </section>

        <section className="card">
          <h2>Account Details / Check Balance</h2>
          <input
            type="text"
            placeholder="Account ID"
            value={checkBalanceId}
            // onChange={(e) => setCheckBalanceId(e.target.value)}
            onChange={(e) => {
              setCheckBalanceId(e.target.value);
              setQueriedBalance(null); // Clear balance display when input changes
              setAccountDetails(null); // Optionally clear details too
            }}
          />
          <button onClick={handleGetAccountById}>Get Details</button>
          <button onClick={handleCheckBalance}>Check Balance</button>
          {accountDetails && (
            <div className="details">
              <h3>Details for {accountDetails.accountId}</h3>
              <p>Balance: ₹{accountDetails.balance}</p>
              <p>Outgoing: ₹{accountDetails.totalOutgoing}</p>
              <p>Created: {new Date(accountDetails.timeStamp * 1000).toLocaleDateString()}</p>
            </div>
          )}
          {queriedBalance !== null && (
            <div className="details">
              <h3>Balance for {checkBalanceId}: ₹{queriedBalance}</h3>
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
                    {spender.accountId}: ₹{spender.totalOutgoing}
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
            <div className="accounts-scroll">
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
                    <td>₹{acc.balance}</td>
                    <td>₹{acc.totalOutgoing}</td>
                    <td>{new Date(acc.timeStamp * 1000).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <p>No accounts found.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;