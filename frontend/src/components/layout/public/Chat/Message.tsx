import React from 'react';

import styles from './Message.module.css';

function Message({ text, myMessage }: { text: string; myMessage?: boolean }): JSX.Element {
  const messageStyles = {
    display: '',
    justifyContent: '',
  };
  if (myMessage) {
    messageStyles.display = 'flex';
    messageStyles.justifyContent = 'flex-end';
  }

  return (
    <>
      <div style={messageStyles}>
        <div className={`${myMessage ? styles['my-message'] : styles['message']}`}>
          {/* <div> */}
          <div className={`${styles['message-tail']}`}></div>
          <span>{text}</span>
        </div>
      </div>
    </>
  );
}

export default Message;
