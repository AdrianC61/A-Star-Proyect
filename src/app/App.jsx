import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import Grid from '../components/Grid';

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Grid />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
