import React from "react";
import { Link } from 'react-router-dom';
import '../App.css';
  
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-title">
        <h3 className="hText">Typing for 2FA</h3>
      </div>
      <div className="navbar-menu">
        <li className="navbar-item">
          <Link className="navbar-link" to="/typingfor2fa">Create Password</Link>
        </li>
        <li className="navbar-item">
          <Link className="navbar-link" to="/typingfor2fa/record">Record/Test Patterns</Link>
        </li>
      </div>
      
    </div>
  );
};
  
export default Navbar;