import React, { memo, ReactNode } from 'react';
import cn from 'classnames';

type Props = {
  children: ReactNode;
  className?: string;
};

const BASE_CLASSES = ['fixed', 'bottom-0', 'left-0', 'w-full'];

export const Footer = memo(({ children, className }: Props) => {
  const classes = cn(className, BASE_CLASSES);

  return (
    <footer className={classes}>
      <div className="text-center p-2">{children}</div>
    </footer>
  );
});
