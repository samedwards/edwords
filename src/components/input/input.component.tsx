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
  'text-5xl',
  'text-center',
  'text-white',
  'bg-black',
  'border-2',
  'opacity-100',
  'w-full',
  'flex items-center',
  'justify-center',
  'md:w-2/12',
  'h-16',
  'm-2',
];

export const Input = ({ className, onChange, type = 'text', isDisabled, ...rest }: Props) => {
  const classes = cn(className, BASE_CLASSES);

  return <input {...rest} className={classes} onChange={onChange} type={type} disabled={isDisabled} required={true} autocomplete="off" />;
};
