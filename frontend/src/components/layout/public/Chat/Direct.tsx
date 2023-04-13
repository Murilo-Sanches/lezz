import React from 'react';

import styles from './Direct.module.css';

import Room from './Room';

function Direct(): JSX.Element {
  return (
    <>
      <div className={`${styles['direct__container']}`}>
        <div className={`${styles['direct__welcome']}`}>
          {/* <h2 className="bold-title">Chat</h2> */}
          <h2 className="bold-title-sans">Conversations</h2>
          {/* <span className="informative__text">
            As mensagens são protegidas com a criptografia de ponta a ponta e ficam somente entre
            você e os participantes da conversa. Nem mesmo o Lezz pode ler ou ouvi-las.
            <a href="" className='informative__text-link'>Clique para saber mais.</a>
          </span> */}
        </div>

        <div className={`${styles['direct__inbox']}`}>
          <Room />
        </div>
      </div>
    </>
  );
}

export default Direct;
