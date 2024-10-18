import React, { useState } from 'react';
import "./App.css";
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

const App = () => {
  const [month, setMonth] = useState('03');

  return (
    <div className="App">
      <h1>Product Transactions</h1>
      <TransactionsTable />
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="01">January</option>
        <option value="02">February</option>
        <option value="03">March</option>
        {/* Add other months */}
      </select>
      
      <Statistics month={month} />
      <TransactionsTable month={month} />
      <BarChart month={month} />
      <PieChart month={month} />
    </div>
    
  );
};

export default App;


