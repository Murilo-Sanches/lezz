import React from 'react';

import styles from './Tooltip.module.css';

type Props = {
  text?: string;
  visible?: boolean;
  children?: JSX.Element;
};

function Tooltip({ text, visible, children }: Props): JSX.Element {
  return (
    <>
      <div className={`${visible ? styles['block'] : styles['hidden']}`}>
        <div className={`${styles['i-tooltip']}`}>
          <div className={`${styles['i-tooltip-triangle-left']}`}></div>
          {text}
        </div>
      </div>
      {/* <div
        style={{ position: 'relative' }}
        className={`${visible ? styles['block'] : styles['hidden']}`}
      >
        {children}
        <div className={`${styles['i-tooltip']}`}>
          <div className={`${styles['i-tooltip-triangle-left']}`}></div>
          {text}
        </div>
      </div> */}
    </>
  );
}

export default Tooltip;
