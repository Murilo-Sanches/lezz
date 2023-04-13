import React from 'react';

import styles from './LeftAsideNav.module.css';

import iconsList from '../../data/iconsList';
import Tooltip from '../../../components/Tooltip';

function LeftAsideNav(): JSX.Element {
  return (
    <>
      <aside className={`${styles['aside']} flex col`}>
        <nav>
          <ul>
            {iconsList.map((icon) => (
              <li key={icon.text} style={{ marginBlock: '2.5rem' }}>
                <button>
                  <i className={`${styles['i']}`}>{icon.icon}</i>
                  {/* <Tooltip text={icon.text} key={icon.text} visible /> */}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

export default LeftAsideNav;
