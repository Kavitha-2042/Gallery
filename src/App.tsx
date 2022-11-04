import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './Pages/Home';
import Header from './Components/Header';
import Signup from './Pages/Signup';
import Signin from './Pages/Signin';
import Signout from './Pages/Signout';
import Profile from './Pages/Profile';
import ImageUpload from './Pages/ImageUpload';

function App() {
  return (
  <div>
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/signin' element={<Signin/>} />
        <Route path='/signout' element={<Signout/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/imageupload' element={<ImageUpload/>} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
