import React from 'react';
import { render } from 'react-dom';

import { ModalProvider } from '@wordle/common';
import { App } from './app';

const jsx = (
  <ModalProvider>
    <App />
  </ModalProvider>
);

render(jsx, document.getElementById('root'));
