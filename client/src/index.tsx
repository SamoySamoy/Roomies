import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeProvider';
import { LandingPage, ExplorePage, RoomPage, ErrorPage } from '@/pages';
import { BoardLayout, RoomLayout, LandingLayout } from '@/layout';
import { Toaster } from '@/components/ui/toaster';
import { store } from '@/redux/store';
import { Provider as ReduxProvider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ReduxProvider store={store}> */}
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/*  */}
          <Route path='/' Component={LandingLayout}>
            <Route index Component={LandingPage} />
          </Route>
          {/*  */}
          <Route Component={BoardLayout} path='/board'>
            <Route Component={ExplorePage} path='explore' />
            {/*  */}
            <Route path='rooms' Component={RoomLayout}>
              <Route Component={RoomPage} index />
            </Route>
          </Route>
          {/*  */}
          <Route path='*' Component={ErrorPage} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
    {/* </ReduxProvider> */}
  </React.StrictMode>,
);
