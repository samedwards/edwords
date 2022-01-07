import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useModal } from '@wordle/common';

export const Modal = () => {
  const { closeModal, modal } = useModal();

  const handleKeydown = ({ code }: KeyboardEvent) => {
    if (code !== 'Escape') {
      return;
    }

    closeModal();
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
      window.scroll(0, 0);
      window.addEventListener('keydown', handleKeydown);
    } else {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeydown);
    }
  }, [modal]);

  return (
    <AnimatePresence>
      {Boolean(modal) && (
        <div className="flex items-center justify-center absolute top-0 right-0 left-0 bottom-0 p-4 z-modal">
          <motion.div
            className="fixed top-0 bottom-0 left-0 right-0 bg-black opacity-60 z-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          />
          <motion.div
            className="bg-black text-white border-2 border-gray-800 rounded-lg shadow-xl overflow-hidden z-modal"
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ y: -5, opacity: 0 }}
          >
            {modal}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
