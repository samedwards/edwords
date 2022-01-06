import React, { ReactNode } from 'react';
import cn from 'classnames';

type Props = {
  className?: string;
  children: ReactNode;
};

const BASE_CLASSES = ['py-8', 'px-6'];

export const ModalHeader = ({ className, children }: Props) => {
  const classes = cn(className, BASE_CLASSES);

  return <div className={classes}>{children}</div>;
};
