import React from 'react';
import Flex from '../../../containers/Flex';

import styles from './Chat.module.css';
import Message from './Message';

function Chat(): JSX.Element {
  return (
    <>
      <div className={`${styles['chat-container']}`}>
        <div className={`${styles['chat__actions']}`}></div>

        <div className={`${styles['chat__messenger']}`}>
          <div className={`${styles['chat__messenger-context']}`}>
            <Message text="Dizes que a beleza não é nada? Imagina um hipopótamo com alma de anjo... Sim, ele poderá convencer os outros de sua angelitude - mas que trabalheira!" />
            <Message
              myMessage
              text="Não acredite em algo simplesmente porque ouviu. Não acredite em algo simplesmente porque todos falam a respeito. Não acredite em algo simplesmente porque está escrito em seus livros religiosos. Não acredite em algo só porque seus professores e mestres dizem que é verdade. Não acredite em tradições só porque foram passadas de geração em geração. Mas, depois de muita análise e observação, se você vê que algo concorda com a razão e que conduz ao bem e benefício de todos, aceite-o e viva-o."
            />
          </div>
          <div className={`${styles['chat__messenger-actions']}`}></div>
        </div>
      </div>
    </>
  );
}

export default Chat;
