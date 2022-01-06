import React, { ChangeEvent, useEffect, useState } from 'react';
import seedrandom from 'seedrandom';

import { dictionary, playerWords } from '@wordle/assets';
import { dayWordCounterStorageName, Footer, Input, lastPlayedDateStorageName, ScreenKeyboard } from '@wordle/common';
import { stringifyNumber } from '@wordle/utils';

const currentDateAsString: string = new Date(Date.now()).toDateString();
const rnd = seedrandom(new Date(Date.now()).toDateString());

// We get a random word based on the total day count retrieved from storage
// It ensures we get a different word if the page is reloaded
const getRandomWord = (numWordsToRun: number): string => {
  for (let i = 0; i < numWordsToRun; i++) {
    rnd();
  }
  return playerWords[(playerWords.length * rnd()) << 0].toUpperCase();;
};

export const App = () => {
  const [isSolved, setIsSolved] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isValidGuess, setIsValidGuess] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [focus, setFocus] = useState(0);
  const [correctLetters, setCorrectLetters] = useState<Array<string>>([]);
  const [closeLetters, setCloseLetters] = useState<Array<string>>([]);
  const [wrongLetters, setWrongLetters] = useState<Array<string>>([]);

  // Retrieve value from local storage, or default to 0 if doesn't already exist
  const [dayWordCounter, setDayWordCounter] = useState(() => {
    // Retrieve the last played date from storage and the last played word counter
    const lastPlayedDate = localStorage.getItem(lastPlayedDateStorageName);
    const lastPlayedWordCount = localStorage.getItem(dayWordCounterStorageName);
    // If we have values for both AND the last played date is today (so not any other day)
    // We them use the word count from the storage
    if (lastPlayedDate && lastPlayedWordCount && lastPlayedDate == currentDateAsString) {
      return Number(lastPlayedWordCount);
    }
    return 0;
  });

  const [word, setWord] = useState(() => getRandomWord(dayWordCounter));

  const letters = word.split('');
  const maxAttempts = letters.length + 1;
  const blankRow: string[] = [];
  for (let i = 0; i < word.length; i++) {
    blankRow.push('');
  }
  const init: string[][] = [];
  for (let i = 0; i < maxAttempts; i++) {
    init.push([...blankRow]);
  }

  const [guesses, setGuesses] = useState(init.map((x) => x.map((y) => y)));
  const [results, setResults] = useState(init.map((x) => x.map((y) => y)));

  useEffect(() => {
    const nextCell = window.document.getElementById(`${attempt * letters.length}`);
    if (nextCell) {
      nextCell.focus();
    }
  }, [attempt]);

  useEffect(() => {
    const guess = guesses[attempt].join('');
    if (guess.length === 5 && dictionary[guess.toLowerCase()]) {
      setIsValidGuess(true);
      return;
    }
    setIsValidGuess(false);
  }, [attempt, guesses]);

  const onChange = (letter: string, row: number, column: number, id: number) => {
    const input = letter.toUpperCase();
    const update = guesses.map((x) => x.map((y) => y));
    update[column][row] = input.charAt(input.length - 1);
    setGuesses(update);

    const nextCell = window.document.getElementById(`${id + 1}`);
    if (column <= letters.length && nextCell && input !== '') {
      nextCell.focus();
    }
  };

  const onCheckClick = () => {
    if (!isValidGuess) {
      return;
    }

    const guess = guesses[attempt];
    const unCheckedLetters = [...letters];
    const correct = correctLetters;
    const close = closeLetters;
    const wrong = wrongLetters;
    let i = letters.length;
    while (i--) {
      if (unCheckedLetters[i] === guess[i]) {
        results[attempt][i] = 'bg-green-500';
        unCheckedLetters.splice(i, 1);
        if (!correct.includes(guess[i])) {
          correct.push(guess[i]);
        }
      }
    }
    results[attempt].forEach((result, i) => {
      if (result === '') {
        if (unCheckedLetters.join('').includes(guess[i])) {
          results[attempt][i] = 'bg-yellow-400';
          unCheckedLetters.splice(unCheckedLetters.join('').indexOf(guess[i]), 1);
          if (!close.includes(guess[i])) {
            close.push(guess[i]);
          }
        } else {
          results[attempt][i] = 'bg-gray-800';
          if (!wrong.includes(guess[i])) {
            wrong.push(guess[i]);
          }
        }
      }
    });

    setResults(results);
    setCorrectLetters(correct);
    setCloseLetters(close);
    setWrongLetters(wrong);

    if (word === guesses[attempt].join('')) {
      setIsSolved(true);
      // Store current word count and date in local storage
      localStorage.setItem(dayWordCounterStorageName, String(dayWordCounter + 1));
      localStorage.setItem(lastPlayedDateStorageName, currentDateAsString);
      return;
    }
    if (attempt + 1 >= maxAttempts) {
      setIsFailed(true);
      // Store current word count and date in local storage
      localStorage.setItem(dayWordCounterStorageName, String(dayWordCounter + 1));
      localStorage.setItem(lastPlayedDateStorageName, currentDateAsString);
      return;
    }
    setAttempt(attempt + 1);
  };

  const onPlayAgainClick = () => {
    setWord(getRandomWord(0));
    setGuesses(init.map((x) => x.map((y) => y)));
    setResults(init.map((x) => x.map((y) => y)));
    setIsFailed(false);
    setIsSolved(false);
    setAttempt(0);
    setCorrectLetters([]);
    setCloseLetters([]);
    setWrongLetters([]);
    setDayWordCounter(dayWordCounter + 1);
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      if (isFailed || isSolved) {
        onPlayAgainClick();
        return;
      }
      onCheckClick();
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, row: number, column: number, id: number) => {
    if (event.key === 'Backspace' && guesses[column][row] === '') {
      const previousCell = window.document.getElementById(`${id - 1}`);
      if (column <= letters.length && previousCell) {
        previousCell.focus();
      }
    }
  };

  const onKeyPress = (letter: string): void => {
    const row = attempt ? focus - attempt * word.length : focus;
    const column = attempt;
    const update = guesses.map((x) => x.map((y) => y));
    if (letter === '{bksp}') {
      if (update[column][row] !== '' && row === word.length - 1) {
        update[column][row] = '';
        setGuesses(update);
        return;
      }

      update[column][row ? row - 1 : row] = '';
      setGuesses(update);
      const previousCell = window.document.getElementById(`${focus - 1}`);
      if (column <= letters.length && previousCell) {
        previousCell.focus();
      }
      return;
    }
    if (letter === '{enter}') {
      if (isFailed || isSolved) {
        onPlayAgainClick();
        return;
      }
      onCheckClick();
      return;
    }

    const input = letter.toUpperCase();
    update[column][row] = input.charAt(input.length - 1);
    setGuesses(update);
    const nextCell = window.document.getElementById(`${focus + 1}`);
    if (nextCell) {
      nextCell.focus();
    }
  };

  let footer = isFailed && (
    <>
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl sm:truncate">Better luck next time! The word was {word}.</h1>
      </div>
      <div className="mt-10 mb-4 flex justify-center">
        <button onClick={onPlayAgainClick} className="bg-black hover:bg-gray-900 border-4 text-white font-bold py-2 px-4">
          Play again?
        </button>
      </div>
    </>
  );

  if (isSolved) {
    footer = (
      <>
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl sm:truncate">Congratulations! The word was {word}.</h1>
        </div>
        <div className="mt-10 mb-4 flex justify-center">
          <button onClick={onPlayAgainClick} className="bg-black hover:bg-gray-900 border-4 text-white font-bold py-2 px-4">
            Play again?
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl sm:truncate mt-2">Wordle</h1>
      </div>
      <div className="flex justify-center">
        <span className="text-white sm:truncate mb-4">
          On the <strong>{stringifyNumber(dayWordCounter + 1)}</strong> word for the day.
        </span>
      </div>
      <div className="flex justify-center">
        <div className="w-60">
          {guesses.map((_, column) => {
            return (
              <div key={column} className="flex items-center">
                {guesses[column].map((_, row) => {
                  const id = column * letters.length + row;
                  return (
                    <Input
                      id={`${id}`}
                      value={guesses[column][row]}
                      key={row}
                      className={results[column][row]}
                      isDisabled={column !== attempt}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value, row, column, id)}
                      onKeyUp={onKeyUp}
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => onKeyDown(e, row, column, id)}
                      onFocus={() => setFocus(id)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <div className="w-96">
          <ScreenKeyboard onKeyPress={onKeyPress} correctLetters={correctLetters} closeLetters={closeLetters} wrongLetters={wrongLetters} />
        </div>
      </div>
      {footer ?? <Footer>{footer}</Footer>}
    </div>
  );
};
