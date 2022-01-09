import React, { ReactNode } from 'react';
import cn from 'classnames';

type Props = {
  className?: string;
  children: ReactNode;
};

const BASE_CLASSES = ['my-3', 'px-6'];

export const ModalFooter = ({ className, children }: Props) => {
  const classes = cn(className, BASE_CLASSES);

  return <div className={classes}>{children}</div>;
};
