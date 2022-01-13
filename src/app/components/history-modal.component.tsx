import React from 'react';

import { ModalContent, ModalFooter, ModalHeader, useModal } from '@edwords/common';

type Props = {
  words: string[];
};

export const HistoryModal = ({ words }: Props) => {
  const { closeModal } = useModal();

  return (
    <div className="max-w-lg w-48">
      <ModalHeader className="text-center">
        <strong>Previous Words</strong>
      </ModalHeader>
      <ModalContent className="text-center max-h-80 overflow-y-scroll">
        {words.map((word: string, index: number) => (
          <div key={index}>{word}</div>
        ))}
      </ModalContent>
      <ModalFooter className="text-center mt-4">
        <button onClick={closeModal} className="bg-black hover:bg-gray-900 border-4 border-gray-800 font-bold py-2 px-4">
          Close
        </button>
      </ModalFooter>
    </div>
  );
};
