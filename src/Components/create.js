import '../App.css';
import { useState, useEffect, useRef } from 'react'
import { Button, Table } from 'react-bootstrap'
import { PythonProvider } from "react-py";
import React from "react";
import { render } from "react-dom";
import patternsData from '../Data/characters.json'
import charactersData from '../Data/characters.json'
import passwordsData from '../Data/passwords.json'


function CreatePassword(props) {
  const [ password, setPassword ] = useState("");
  const [ oldPassword, setOldPassword ] = useState("");
  const [ bruteForce, setBruteForce ] = useState(0);
  const [ weightedChars, setWeightedChars ] = useState(0);
  const [ charsPatterns, setCharsPatterns ] = useState(0);
  const [ commonPassword, setCommonPassword ] = useState(0);
  const patterns = useRef({});
  const characters = useRef({});
  const passwords = useRef({});
  const overflow = "Sorry, you overflowed...but you have a strong password with this metric!";

  useEffect(() => {
    patterns.current = JSON.parse(JSON.stringify(patternsData));
    characters.current = JSON.parse(JSON.stringify(charactersData));
    passwords.current = JSON.parse(JSON.stringify(passwordsData));
  }, []);  
  
  useEffect(() => {
    if (password != "") {
      evaluatePassword();
    } else {
      clearPassword();
    }
  }, [password]); 

  var updatePassword = event => {
    const value = event.target.value;
    if (value != " ") {
      setOldPassword(password);
      setPassword(value);
    }
  }

  var clearPassword = () => {
    setWeightedChars(0);
    setCharsPatterns(0);
    setBruteForce(0);
    setCommonPassword(0);
  }

  var evaluatePassword = () => {
    let strength = 1;
    for (let i = 0; i < password.length; i++) {
      console.log(characters.current[password[i]]);
      strength *= characters.current[password[i]];
    }
    setWeightedChars(((1 / strength) + 1) < (Math.pow(2, 53) - 1) ? parseInt(1 / strength) + 1 : overflow);

    let newBruteForce = Math.pow(93, password.length) + 1;
    setBruteForce(newBruteForce < (Math.pow(2, 53) - 1) ? newBruteForce / 2 : overflow);

    let strength2 = 1;
    let j = 0;
    let pattern_keys = Object.keys(patterns.current);
    while (j < password.length) {
      let best = "";
      for (let k = 0; k < pattern_keys.length; k++) {
        let pattern = pattern_keys[k];
        if (pattern == password.substring(j, j + pattern.length) && pattern.length > best.length) {
          best = pattern;
        }
      }
      strength2 *= patterns.current[best];
      j += best.length;
    }

    setCharsPatterns(((1 / strength2) + 1) < (Math.pow(2, 53) - 1) ? parseInt(1 / strength2) + 1 : overflow)

    let password_keys = Object.keys(passwords.current);
    setCommonPassword(0)
    for (let i = 0; i < password_keys.length; i++) {
      if (password == password_keys[i]) {
        setCommonPassword(passwords.current[password]);
      }
    }

    props.updateUserPassword(password);

  }

  return (
    <>
    <div className="App-page">
      <h2 className="hText">Evaluate a password!</h2>
      <article className="bText">Enter your password and click save to test your typing patterns on the next page!</article>
      <p></p>
      <form>
        <input className="password-input" value={password} onChange={updatePassword}></input>
        <Button type="button" className="password-button" onClick={evaluatePassword}>Save</Button>
      </form>
      <p/>
      <Table striped bordered hover className="password-table">
      <thead>
        <tr>
          <th className="password-th">Type</th>
          <th>Expected Tries</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Brute Force</td>
          <td>{bruteForce}</td>
        </tr>
        <tr>
          <td>Weighted Characters</td>
          <td>{weightedChars}</td>
        </tr>
        <tr>
          <td>Patterns</td>
          <td>{charsPatterns}</td>
        </tr>
        <tr>
          <td>Common Password?</td>
          <td>{commonPassword != 0 ? `${commonPassword} known users have this password!` : "Not Common"}</td>
        </tr>
      </tbody>
    </Table>
    <h3> </h3>
    <h3 className="hText">How Do You Calculate These?</h3>
      <article className="bText explanations">Brute force takes on a simplistic view where each character is weighted evenly. 
      In the calculation, there are 93 possible characters–including lowercase and uppercase letters, numbers, and special characters–
      so brute force can be calculated by multiplying the number of outcomes for each character position. 
      In other words, a password of length n would have 93^n possible combinations. 
      </article>
      <p></p>
      <article className="bText explanations">Weighted characters are calculated by determining the probability of each character occurring
      from prior password data. Characters like "a" and "1" are used more often so the probability of these characters
      occurring will be greater.</article>
      <p></p>
      <article className="bText explanations">Patterns are calculated by determining the probability of characters and various patterns occurring 
      from prior password data. Patterns can include "aa", "ite", "mm", and "er". Patterns is meant to try to take into account the idea that
      passwords are not truly random and often come from names and words.</article>
      <p></p>
      <article className="bText explanations">Common Password? compares the inputted password with a database of common passwords returning the number
      of users that are reported to have that password. However, it is important to note that a password can still be weak even if it is marked Not common.</article>
      <p></p>
    </div>
      
    </>
  );
}

export default CreatePassword;
