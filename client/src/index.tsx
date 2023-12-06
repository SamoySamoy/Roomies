import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';
import { LandingPage, ChatPage, ErrorPage } from '@/pages';
import ChatLayout from '@/layout/ChatLayout';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path='/' index Component={LandingPage} />
          <Route path='/chat' Component={ChatLayout}>
            <Route Component={ChatPage} index />
          </Route>
          <Route path='*' Component={ErrorPage} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
