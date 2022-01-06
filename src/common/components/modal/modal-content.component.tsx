import React, { ReactNode } from 'react';
import cn from 'classnames';

type Props = {
  className?: string;
  children: ReactNode;
};

const BASE_CLASSES = ['p-6'];

export const ModalContent = ({ className, children }: Props) => {
  const classes = cn(className, BASE_CLASSES);

  return <div className={classes}>{children}</div>;
};
