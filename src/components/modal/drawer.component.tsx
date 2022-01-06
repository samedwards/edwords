import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useModal } from '@wordle/components';

export const Drawer = () => {
  const { modal, drawer, closeDrawer } = useModal();

  const handleKeydown = ({ code }: KeyboardEvent) => {
    if (code !== 'Escape') {
      return;
    }

    if (!modal) {
      closeDrawer();
    }
  };

  useEffect(() => {
    if (drawer) {
      document.body.style.overflow = 'hidden';
      window.scroll(0, 0);
      window.addEventListener('keydown', handleKeydown);
    } else {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeydown);
    }
  }, [drawer]);

  return (
    <AnimatePresence>
      {Boolean(drawer) && (
        <div className="flex items-start justify-end absolute top-0 right-0 left-0 bottom-0 overflow-hidden z-drawer">
          <motion.div
            className="fixed top-0 bottom-0 left-0 right-0 bg-black opacity-60 z-drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          />
          <motion.div
            className="relative bg-white shadow-xl h-full w-full max-w-screen-lg z-drawer overflow-y-scroll scrollbar-hide"
            initial={{ x: 5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            exit={{ x: 5, opacity: 0 }}
          >
            {drawer}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
