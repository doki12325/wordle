import { useCallback, useEffect, useState } from "react";
import { wordlistorg, alphabets } from "./worddata";

import "./App.css";

function App() {
  const generateWord = () => {
    const wordlist = wordlistorg;
    const word = wordlist[Math.floor(Math.random() * wordlist.length)];
    return word.toUpperCase();
  };
  const wordExists = (word) => {
    const wordlist = wordlistorg;
    const newword = word.toLowerCase();
    if (wordlist.includes(newword)) {
      return true;
    }
    return false;
  };
  const [mainword, setMainword] = useState(generateWord());
  const [words, setWords] = useState({
    word: [" ", " ", " ", " ", " "],
    wordindex: 0,
    row: 0,
    usedLetters: [],
    messagestatus: false,
    wordlist: [
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " "],
    ],
    gamestatus: true,
    win: false,
  });

  const keyhandle = useCallback((e) => {
    if (e.key === "Enter") {
      setWords((prev) => {
        const newWords = [...prev.wordlist];
        newWords[prev.row] = prev.word;
        const letters = [...prev.usedLetters];
        prev.word.map((data) => {
          if (!letters.includes(data)) letters.push(data);
        });
        if (prev.row == 6) return { ...prev };
        if (wordExists(prev.word.join("")) && words.word.length == 5)
          return {
            ...prev,
            word: [" ", " ", " ", " ", " "],
            wordindex: 0,
            row: prev.row + 1,
            wordlist: newWords,
            usedLetters: letters,
            messagestatus: false,
          };
        const el = document.getElementById("row" + prev.row);
        el.classList.add("shake");
        setTimeout(() => {
          el.classList.remove("shake");
        }, 500);
        return { ...prev, messagestatus: true };
      });
    } else if (e.key === "Backspace") {
      setWords((prev) => {
        const newWord = [...prev.word];
        newWord[prev.wordindex - 1] = " ";
        if (prev.wordindex > 0)
          return { ...prev, word: newWord, wordindex: prev.wordindex - 1 };
        return { ...prev };
      });
    } else {
      setWords((prev) => {
        const newWord = [...prev.word];
        newWord[prev.wordindex] = e.key.toUpperCase();
        if (prev.wordindex < 5 && alphabets.includes(e.key.toUpperCase()))
          return { ...prev, word: newWord, wordindex: prev.wordindex + 1 };
        return { ...prev };
      });
    }
  }, []);

  useEffect(() => {
    if (words.row != 0) {
      const el = document.getElementById(
        `row${words.row == 0 ? 0 : words.row - 1}`
      );
      if (!el) return;
      el.classList.add("reveal");
      setTimeout(() => {
        el.classList.remove("reveal");
      }, 2000);
    }
  }, [words.row]);

  useEffect(() => {
    const el = document.getElementById(
      `${words.row}${words.wordindex == 0 ? 0 : words.wordindex - 1}`
    );
    if (!el) return;
    el.classList.add("boop");
    setTimeout(() => {
      el.classList.remove("boop");
    }, 500);
  }, [words.word]);

  useEffect(() => {
    document.addEventListener("keydown", keyhandle, true);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setWords((prev) => {
        return { ...prev, messagestatus: false };
      });
    }, 1000);
  }, [words.messagestatus]);
  useEffect(() => {
    if (words.row == 6) {
      document.removeEventListener("keydown", keyhandle, true);
      setWords((prev) => {
        if (words.wordlist[5].join("") == mainword)
          return { ...prev, gamestatus: false, win: true };
        return { ...prev, gamestatus: false, win: false };
      });
    }
    const row = words.row == 0 ? 0 : words.row - 1;
    if (words.wordlist[row].join("") == mainword) {
      document.removeEventListener("keydown", keyhandle, true);
      setWords((prev) => {
        return { ...prev, gamestatus: false, win: true };
      });
    }
  }, [words.row]);
  return (
    <div className="main-container">
      <div
        className={`error-message ${
          words.messagestatus ? "status-visible" : ""
        }`}
      >
        Not in Word List
      </div>
      <div className="main-game">
        <div className="switch">
          <span>?</span>
        </div>
        <div className="game-container">
          {words.wordlist.slice(0, 6).map((word1, rowindex) => (
            <div key={rowindex} id={`row${rowindex}`} className="word-row">
              {words.row != rowindex
                ? word1.slice(0, 5).map((data, index) => (
                    <div
                      key={index}
                      id={`${rowindex}${index}`}
                      className={`word ${
                        data == mainword[index] ? "correct" : ""
                      } ${mainword.split("").includes(data) ? "present" : ""}`}
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      {data}
                    </div>
                  ))
                : words.word.slice(0, 5).map((data, index) => (
                    <div
                      key={index}
                      id={`${rowindex}${index}`}
                      className="word"
                    >
                      {data}
                    </div>
                  ))}
            </div>
          ))}
        </div>
      </div>
      <div className="keyboard">
        {alphabets.map((data, index) => (
          <div
            onClick={(e) => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: data })
              );
            }}
            key={index}
            id={data}
            className={`key ${words.usedLetters.includes(data) ? "used" : ""} ${
              mainword.split("").includes(data) &&
              words.usedLetters.includes(data)
                ? "correct"
                : ""
            }`}
          >
            {data}
          </div>
        ))}
        <div
          onClick={(e) => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Enter" })
            );
          }}
          className={`key enterkey`}
        >
          Enter
        </div>
        <div
          onClick={(e) => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Backspace" })
            );
          }}
          className={`key enterkey`}
        >
          Back
        </div>
      </div>
      <div
        className="gameend"
        style={{
          display: words.gamestatus ? "none" : "flex",
        }}
      >
        <h1 className="game-result">
          {words.win ? "Congratulations!" : "Try Again!"}
        </h1>
        <div className="word-container">
          <p className="game-word-present">
            {words.win
              ? "You have correctly guessed the word :"
              : "The correct word was :"}
          </p>
          <h2 className="game-word">{mainword}</h2>
        </div>
        <button
          className="restart-button"
          onClick={(e) => {
            e.preventDefault();
            location.reload();
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default App;
