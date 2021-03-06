import React, { ChangeEvent, useEffect, useState } from 'react';
import seedrandom from 'seedrandom';

import { CompletionModal, HistoryModal } from '@edwords/app/components';
import { dictionary, playerWords } from '@edwords/assets';
import { dayWordCounterStorageName, Input, lastPlayedDateStorageName, ScreenKeyboard, useModal } from '@edwords/common';
import { stringifyNumber } from '@edwords/utils';

const currentDateAsString: string = new Date(Date.now()).toDateString();
const rnd = seedrandom(new Date(Date.now()).toDateString());

export const App = () => {
  const { openModal } = useModal();
  const [isSolved, setIsSolved] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isValidGuess, setIsValidGuess] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [focus, setFocus] = useState(0);
  const [correctLetters, setCorrectLetters] = useState<Array<string>>([]);
  const [closeLetters, setCloseLetters] = useState<Array<string>>([]);
  const [wrongLetters, setWrongLetters] = useState<Array<string>>([]);
  const [previousWords, setPreviousWords] = useState<Array<string>>([]);

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

  const getRandomWord = (numWordsToRun: number): string => {
    const oldWords = [];
    for (let i = 0; i < numWordsToRun; i++) {
      oldWords.push(playerWords[(playerWords.length * rnd()) << 0].toUpperCase());
    }
    numWordsToRun && setPreviousWords(oldWords);

    return playerWords[(playerWords.length * rnd()) << 0].toUpperCase();
  };

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
        if (close.includes(guess[i])) {
          close.splice(close.indexOf(guess[i]), 1);
        }
      }
    }
    results[attempt].forEach((result, i) => {
      if (result === '') {
        if (unCheckedLetters.join('').includes(guess[i])) {
          results[attempt][i] = 'bg-yellow-400';
          unCheckedLetters.splice(unCheckedLetters.join('').indexOf(guess[i]), 1);
          if (!close.includes(guess[i]) && !correct.includes(guess[i])) {
            close.push(guess[i]);
          }
        } else {
          results[attempt][i] = 'bg-gray-800';
          if (!wrong.includes(guess[i]) && !correct.includes(guess[i]) && !close.includes(guess[i])) {
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
      setPreviousWords([...previousWords, word]);
      // Store current word count and date in local storage
      localStorage.setItem(dayWordCounterStorageName, String(dayWordCounter + 1));
      localStorage.setItem(lastPlayedDateStorageName, currentDateAsString);
      openModal(<CompletionModal success={true} word={word} onPlayAgain={onPlayAgainClick} />);
      return;
    }
    if (attempt + 1 >= maxAttempts) {
      setIsFailed(true);
      setPreviousWords([...previousWords, word]);
      // Store current word count and date in local storage
      localStorage.setItem(dayWordCounterStorageName, String(dayWordCounter + 1));
      localStorage.setItem(lastPlayedDateStorageName, currentDateAsString);
      openModal(<CompletionModal success={false} word={word} onPlayAgain={onPlayAgainClick} />);
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

  return (
    <div className="w-full">
      <div className="flex">
        <div className="w-2/12"></div>
        <div className="w-8/12 flex justify-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl sm:truncate mt-2">Edwords</h1>
        </div>
        <div className="w-2/12">
          {previousWords.length && (
            <svg
              onClick={() => openModal(<HistoryModal words={previousWords} />)}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mt-2 mr-2 float-right"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#fff"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          )}
        </div>
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
                      isDisabled={column !== attempt || isSolved || isFailed}
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
    </div>
  );
};
