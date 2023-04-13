import React from 'react';

import styles from './ChatSection.module.css';

import Flex from '../../../containers/Flex';
import Direct from './Direct';
import Chat from './Chat';

function ChatSection(): JSX.Element {
  return (
    <>
      <div className="inherit" style={{ padding: '2rem 3rem 2rem 0' }}>
        <Flex additionalStyles={`${styles['chat-section']}`}>
          <Direct />

          <Chat />
        </Flex>
      </div>
    </>
  );
}

export default ChatSection;
