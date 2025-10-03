import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container">
        <ul>
          <li>
            <Link 
              to="/pessoas" 
              className={location.pathname.startsWith('/pessoas') ? 'active' : ''}
            >
              Pessoas
            </Link>
          </li>
          <li>
            <Link 
              to="/contas" 
              className={location.pathname.startsWith('/contas') ? 'active' : ''}
            >
              Contas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

