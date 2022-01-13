import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { Drawer, Modal } from '@edwords/common';

export type ModalContextType = {
  closeDrawer: () => void;
  closeModal: () => void;
  drawer: ReactNode;
  modal: ReactNode;
  openDrawer: (drawer: ReactNode) => void;
  openModal: (modal: ReactNode) => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalContextType['modal']>(null);
  const [drawer, setDrawer] = useState<ModalContextType['drawer']>(null);

  const value = useMemo(
    () => ({
      closeDrawer: () => setDrawer(null),
      closeModal: () => setModal(null),
      drawer,
      modal,
      openDrawer: (drawer: ReactNode) => setDrawer(drawer),
      openModal: (modal: ReactNode) => setModal(modal),
    }),
    [modal, drawer]
  );

  return (
    <ModalContext.Provider value={value}>
      <Drawer />
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('This component must be used within a <ModalProvider> component.');
  }

  return context;
};
