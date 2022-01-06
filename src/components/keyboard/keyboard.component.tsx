import React from 'react';
import SimpleKeyboard from 'react-simple-keyboard';

type Props = {
  correctLetters: string[];
  closeLetters: string[];
  wrongLetters: string[];
  onChange?: (input: string) => any;
  onKeyPress: (button: string) => any;
};

export const ScreenKeyboard = ({ onChange, onKeyPress, correctLetters, closeLetters, wrongLetters }: Props) => {
  return (
    <SimpleKeyboard
      onChange={onChange}
      onKeyPress={onKeyPress}
      layout={{
        default: ['Q W E R T Y U I O P', 'A S D F G H J K L', '{enter} Z X C V B N M {bksp}'],
      }}
      display={{
        '{bksp}': '⌫',
        '{enter}': 'ENTER',
      }}
      buttonTheme={[
        {
          buttons: correctLetters.join(' '),
          class: 'hg-button-correct',
        },
        {
          buttons: closeLetters.join(' '),
          class: 'hg-button-close',
        },
        {
          buttons: wrongLetters.join(' '),
          class: 'hg-button-wrong',
        },
      ]}
    />
  );
};
