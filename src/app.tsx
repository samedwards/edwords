import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import seedrandom from 'seedrandom';

import { Footer, Input } from '@wordle/components';
import { dictionary, playerWords } from '@wordle/assets';
import { stringifyNumber } from '@wordle/utils';

// Used as a variable name for the local storage
const lastPlayedDateStorageName = 'lastPlayedDate';
const dayWordCounterStorageName = 'currentDayWordCounter';

const currentDateAsString: string = new Date(Date.now()).toDateString();
const rnd = seedrandom(new Date(Date.now()).toDateString());

// We get a random word based on the total day count retrieved from storage
// It ensures we get a different word if the page is reloaded
const getRandomWord = (numWordsToRun: number): string => {
  let theWord = '';
  for (let i = 0; i < numWordsToRun; i++) {
    theWord = playerWords[(playerWords.length * rnd()) << 0].toUpperCase();
  }
  return theWord;
};

export const App = () => {
  const [isSolved, setIsSolved] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isValidGuess, setIsValidGuess] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Retrieve value from local storage, or default to 1 if doesn't already exist
  const [dayWordCounter, setDayWordCounter] = useState(() => {
    // Retrieve the last played date from storage and the last played word counter
    const lastPlayedDate = localStorage.getItem(lastPlayedDateStorageName);
    const lastPlayedWordCount = localStorage.getItem(dayWordCounterStorageName);
    // If we have values for both AND the last played date is today (so not any other day)
    // We them use the word count from the storage
    if (lastPlayedDate && lastPlayedWordCount && lastPlayedDate == currentDateAsString) {
      return Number(lastPlayedWordCount);
    }
    return 1;
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
    let i = letters.length;
    while (i--) {
      if (unCheckedLetters[i] === guess[i]) {
        results[attempt][i] = 'bg-green-500';
        unCheckedLetters.splice(i, 1);
      }
    }
    results[attempt].forEach((result, i) => {
      if (result === '') {
        if (unCheckedLetters.join('').includes(guess[i])) {
          results[attempt][i] = 'bg-yellow-400';
          unCheckedLetters.splice(unCheckedLetters.join('').indexOf(guess[i]), 1);
        } else {
          results[attempt][i] = 'bg-red-600';
        }
      }
    });
    setResults(results);
    if (word === guesses[attempt].join('')) {
      setIsSolved(true);
      // Store current word count and date in local storage
      localStorage.setItem(dayWordCounterStorageName, String(Number(dayWordCounter) + 1));
      localStorage.setItem(lastPlayedDateStorageName, currentDateAsString);
      return;
    }
    if (attempt + 1 >= maxAttempts) {
      setIsFailed(true);
      return;
    }
    setAttempt(attempt + 1);
  };

  const onPlayAgainClick = () => {
    setWord(getRandomWord(1));
    setGuesses(init.map((x) => x.map((y) => y)));
    setResults(init.map((x) => x.map((y) => y)));
    setIsFailed(false);
    setIsSolved(false);
    setAttempt(0);
    setDayWordCounter(dayWordCounter + 1);
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      if (isFailed || isSolved) {
        onPlayAgainClick();
        return;
      }
      onCheckClick();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, row: number, column: number, id: number) => {
    if (event.key === 'Backspace' && guesses[column][row] === '') {
      const previousCell = window.document.getElementById(`${id - 1}`);
      if (column <= letters.length && previousCell) {
        previousCell.focus();
      }
    }
  };

  const failed = isFailed && (
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

  const body = isSolved ? (
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
  ) : (
    <>
      <div className="m-4 flex justify-center">
        <button
          onClick={onCheckClick}
          className={cn('bg-black hover:bg-gray-900 border-4 text-white font-bold py-2 px-4', {
            'pointer-events-none opacity-50': !isValidGuess,
          })}
        >
          Check
        </button>
      </div>
    </>
  );

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl sm:truncate mt-2">Wordle</h1>
      </div>
      <div className="flex justify-center">
        <span className="text-white sm:truncate mb-4">
          On the <strong>{stringifyNumber(dayWordCounter)}</strong> word for the day.
        </span>
      </div>
      <div className="flex justify-center">
        <div className="w-500">
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
                      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => onKeyDown(e, row, column, id)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <Footer>{failed || body}</Footer>
    </div>
  );
};
