import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PessoasList from './pages/PessoasList';
import ContasList from './pages/ContasList';
import ContaDetails from './pages/ContaDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/pessoas" />} />
          <Route path="/pessoas" element={<PessoasList />} />
          <Route path="/contas" element={<ContasList />} />
          <Route path="/contas/:id" element={<ContaDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


