import React from 'react';
import Flex from '../../../containers/Flex';

import styles from './Room.module.css';

function Room(): JSX.Element {
  return (
    <>
      <Flex styles={{ height: '7.5rem' }}>
        <div className={`${styles['notification__container']}`}>
          <div className={`${styles['notification-icon']}`}></div>
        </div>

        <div className={`${styles['subject__container']}`}>
          <Flex>
            <div className={`${styles['subject__pic']}`}>
              <img
                src="https://images.unsplash.com/photo-1574169208507-84376144848b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=579&q=80"
                alt=""
              />
            </div>

            <div className={`${styles['subject__profile']}`}>
              <span className={`${styles['subject-username']}`}>@ms</span>
              <span className={`${styles['subject-message']}`}>
                Não é estranho que um
                {/* <br /> */}
                Deus onipotente só fale com os humanos dentro dos limites de seus crânios? É como se
                fosse o único lugar onde ele existisse
              </span>
            </div>
          </Flex>
        </div>
      </Flex>
    </>
  );
}

export default Room;
