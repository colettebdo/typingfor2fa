import { useState, useEffect } from 'react';

//1
const useKeyPress = callback => {
    //2
    const [keyPressed, setKeyPressed] = useState();
    //3
    useEffect(() => {
        //4
        const downHandler = (e) => {
            const { key } = e;
            if ((key.length === 1 || key === "Backspace")) {
                setKeyPressed(key);
                callback && callback(key);
            }

            if (e.keyCode == 32 && e.target == document.body) {
                // Prevent spaces from scrolling the page
                e.preventDefault();
            }
        };
        //5
        const upHandler = () => {
            setKeyPressed(null);
        };

        //6
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            //7
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);
    //8
    return keyPressed;
};

export default useKeyPress;