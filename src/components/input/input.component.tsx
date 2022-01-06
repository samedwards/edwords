import React, { HTMLProps, ChangeEvent } from 'react';
import cn from 'classnames';

type Props = Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'required' | 'disabled'> & {
  onChange: (event: ChangeEvent<HTMLInputElement>) => any;
  isDisabled?: boolean;
};

const BASE_CLASSES = [
  'block',
  'form-input',
  'rounded-none',
  'relative',
  'text-3xl',
  'text-center',
  'text-white',
  'opacity-100',
  'flex items-center',
  'justify-center',
  'h-12',
  'w-12',
  'm-0.5',
];

export const Input = ({ className, onChange, type = 'text', isDisabled, ...rest }: Props) => {
  const classes = cn(className, BASE_CLASSES, {
    'bg-black border-2 border-gray-700 focus:outline-none': !className?.includes('bg-'),
    'border-none': className?.includes('bg-'),
  });

  return (
    <input {...rest} className={classes} onChange={onChange} type={type} disabled={isDisabled} required={true} autoComplete="off" inputMode="none" />
  );
};
