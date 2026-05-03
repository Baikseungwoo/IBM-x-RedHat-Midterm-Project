import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const HeaderLayout = () => {
  return (
    <div className="App">
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
      {/* Footer 뺌 */}
    </div>
  );
};

export default HeaderLayout;