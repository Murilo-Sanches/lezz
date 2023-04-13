import React from 'react';

import './App.css';

import Flex from './components/containers/Flex';
import ChatSection from './components/layout/public/Chat/ChatSection';
import LeftAsideNav from './components/layout/public/LeftAsideNav/LeftAsideNav';

function App() {
  return (
    <div className="App">
      <Flex>
        <LeftAsideNav />
        <main style={{ width: '100%', height: '100%' }}>
          <ChatSection />
        </main>
      </Flex>
    </div>
  );
}

export default App;
