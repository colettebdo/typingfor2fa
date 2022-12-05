import React from 'react';
import '../App.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useKeyPress from './useKeyPress.js'
import useStateRef from 'react-usestateref'
import usersData from '../Users/data.json'
import { calculateMinDistance, determineUser } from '../Logic/kNNalgorithm.js'
import { calculateMeanVariance, determineUserBayes } from '../Logic/bayesAlgorithm.js'


import { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import Plot from 'react-plotly.js';

const RecordPatterns = (props) => {

    const users = useRef({});
    const currentTime = () => new Date().getTime();
    const [ text, setText ] = useState("");
    const [ stats, setStats, statsRef ] = useStateRef([0, 0]);
    const [ inputtedPassword, setInputtedPassword ] = useState("")
    const [ times, setTimes, timesRef ] = useStateRef([]);
    const [ inputTimes, setInputTimes, inputTimesRef ] = useStateRef([]);
    const [ timer, setTimer, timerRef ] = useStateRef(null);
    const isTyping = useRef(false);
    const [ successBayes, setSuccessBayes ] = useState("");
    const [ successKNN, setSuccessKNN ] = useState("");
    const [ histogram, setHistogram ] = useState(
        [{
            x: [],
            type: 'histogram',
            mode: 'lines+markers',
            marker: {color: 'red'},
        }]
    );

    const sampleText = `The single most important random variable type is the Normal random variable, parametrized by a mean and variance. The normal is important for many reasons: it is generated from the summation of independent random variables and as a result it occurs often in nature. Many things in the world are not distributed normally but we model them as Normal distributions anyways. Like your typing distribution!`
    // const sampleText = `Hello there`;
    const textByLine = sampleText.split("\n")
    
    const [ charsToType, setCharsToType, charsToTypeRef ] = useStateRef([]);
    const [ charsTyped, setCharsTyped, charsTypedRef ] = useStateRef([]);

    useEffect(() => {
        const chars = textByLine.map(line => line.trim().split("").map(c => c)).flat()
        setCharsToType(chars);
        users.current = JSON.parse(JSON.stringify(usersData));
    }, []);

    useKeyPress(key => {
        if (isTyping.current) {
            setTimes([...timesRef.current, currentTime()])

            let numTyped = charsTyped.length;
            
            let newCharsTyped = [...charsTypedRef.current]
            if (key == "Backspace") {
                newCharsTyped.pop();
                setCharsTyped(newCharsTyped);
            } else {
                newCharsTyped.push(key)
                setCharsTyped(newCharsTyped);
            }
            if (newCharsTyped.length == charsToTypeRef.current.length) {
                timerRef.current = null;
                displayTimes();
            }
        }
      });

    var updateInputtedPassword = event => {
        if (timerRef.current == null && inputtedPassword.length != 0) {
            setTimer(currentTime());
        } else {
            let keystroke = (currentTime() - timerRef.current);
            console.log(keystroke);
            console.log(timerRef.current);
            if (keystroke < 10000) {
                setInputTimes([...inputTimesRef.current, keystroke]);
                setTimer(currentTime());
            } 
        }
        setInputtedPassword(event.target.value);
    }

    var validatePassword = () => {
        if (props.userPassword == "") {
            setSuccessBayes("You haven't set your password yet!");
        } else if (props.userPassword != inputtedPassword) {
            setSuccessBayes("Wrong password!");
        } else {
            console.log(inputTimesRef.current);
            console.log("Length " + inputTimesRef.current.length)
            let kNearestClass = kNearestNeighbor();
            let bayesClass = bayesianClassifier();

            console.log("kNN = " + kNearestClass);
            console.log("Bayes = " + bayesClass);

            if (bayesClass == 0) {
                setSuccessBayes("Success! You are verified! (from Bayes Theorem)");
            } else {
                setSuccessBayes("You are unverified. (from Bayes Theorem)");
            }

            if (kNearestClass == 0) {
                setSuccessKNN("Success! You are verified! (from k-Nearest Neighbor)");
            } else {
                setSuccessKNN("You are unverified. (from k-Nearest Neighbor)");
            }

        }
        inputTimesRef.current = [];
        setInputtedPassword("");
        timerRef.current = null;
    }

    function bayesianClassifier() {
        let distributions = [];

        distributions.push(calculateMeanVariance(timesRef.current));
        let userNames = Object.keys(users.current);
        for (let i = 0; i < userNames.length; i++) {
            distributions.push(calculateMeanVariance(users.current[userNames[i]]));
        }

        return determineUserBayes(distributions, inputTimesRef.current);
    }

    function kNearestNeighbor() {
        let distances = [];
        for (let i = 0; i < timesRef.current.length; i++) {
            distances.push([calculateMinDistance(inputTimesRef.current, timesRef.current[i]), 0])
        }
        let userNames = Object.keys(users.current);
        for (let i = 0; i < userNames.length; i++) {
            let values = users.current[userNames[i]];
            for (let j = 0; j < values.length; j++) {
                distances.push([calculateMinDistance(inputTimesRef.current, values[j]), i + 1]);
            }
        }
            
        return determineUser(distances, userNames.length + 1, parseInt(Math.sqrt(distances.length)));
    }
    
    function displayTimes() {
        let timesDiff = [];
        for (let i = 0; i < timesRef.current.length - 1; i++) {
            timesDiff.push(timesRef.current[i + 1] - timesRef.current[i])
        }
        setStats(calculateMeanVariance(timesDiff));
        const newHistogram = [...histogram];
        newHistogram[0]['x'] = timesDiff;
        console.log(newHistogram);
        setHistogram(newHistogram);
        setTimes(timesDiff);
        isTyping.current = false;
    }

    function startTyping() {
        isTyping.current = true;
    }

    function clearHistogram() {
        const newHistogram = [...histogram];
        newHistogram[0]['x'] = [];
        setHistogram(newHistogram);
        times.current = [];
        setCharsTyped([]);
        setStats([0, 0])
        isTyping.current = false;
    }
    
    let chrCount = -1;

    return (
        <>
        <div className="App-page">
            <h3 className="hText">Record your typing patterns by typing the text below!</h3>
            <p></p>
            <p className="bText explanations">Type comfortably! This is not a race. Typing your normal speed will lead to more accurate results. Try to correct any errors with backspace. Press start and type whenever you're ready.</p>
            {textByLine.map((line, i) =>
            <Box className="text-box" key={i}>
            {
                line.trim().split("").map((chr) => {
                chrCount += 1
                return (
                    <span key={chrCount} className={`hText ${charsTyped.length - 1 < chrCount ? "untyped" : charsTyped[chrCount] === charsToType[chrCount] ? "correct" : "incorrect"} `}>{chr}</span>
                )
                })
            }
            </Box>
            )}
            <div className="graph-formatting">
                <Button className="password-button" onClick={startTyping}>{ isTyping.current == true ? "typing..." : "Start"}</Button>
            </div>
            <div className="graph-formatting">
            <Plot data={histogram} layout={ {width: 600, height: 400, title: 'Your Biometric Keystrokes'} } />
            <div className="data">
                <h3 className="hText">Your Typing Distribution:</h3>
                <h4 className="hText">Mean: {stats[0]}</h4>
                <h4 className="hText">Standard Deviation: {Math.sqrt(stats[1])}</h4>
            </div>
            
            </div>
        </div>
        <div className="App-page">
            <h3 className="hText">Try logging in with your saved password!</h3>
            <form>
            <input value={inputtedPassword} onChange={updateInputtedPassword} className="password-input"></input>
            <Button onClick={validatePassword} className="password-button">Login</Button>
            </form>
            <p></p>
            <p className="bText">{successBayes}</p>
            <p className="bText">{successKNN}</p>
        </div>
        </>
    );
};

export default RecordPatterns;
