import React from 'react';

import { ModalContent, ModalFooter, useModal } from '@wordle/common';

type Props = {
  success: boolean;
  word: string;
  onPlayAgain: () => void;
};

export const CompletionModal = ({ success, word, onPlayAgain }: Props) => {
  const { closeModal } = useModal();

  const handleOnPlayAgainClick = () => {
    onPlayAgain();
    closeModal();
  };

  return (
    <div className="max-w-lg">
      <ModalContent className="text-center">
        <div>{success ? 'Congratulations!' : 'Better luck next time!'}</div>
        <div>
          The word was <strong>{word}</strong>.
        </div>
      </ModalContent>
      <ModalFooter className="text-center">
        <button onClick={handleOnPlayAgainClick} className="bg-black hover:bg-gray-900 border-4 border-gray-800 font-bold py-2 px-4">
          Play again?
        </button>
      </ModalFooter>
    </div>
  );
};
