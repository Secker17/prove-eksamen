// npm installs: 
// npm install react-router-dom

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/main/main';
import Editor from './pages/editor/editor'; // Importer Editor siden
import UserList from './pages/users/users';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<Editor />} /> {/* Legg til rute for Editor siden */}
        <Route path="/users" element={<UserList />} /> {/* Legg til rute for Editor siden */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
