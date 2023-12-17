import 'unfonts.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeProvider from '@/context/ThemeProvider';
import ModalProvider from '@/context/ModalProvider';
import SocketProvider from '@/context/SocketProvider';
import QueryProvider from '@/context/QueryProvider';
import {
  LandingPage,
  ExplorePage,
  RoomPage,
  ErrorPage,
  ChannelPage,
  ConversationPage,
  LoginPage,
  RegisterPage,
} from '@/pages';
import { BoardLayout, RoomLayout, LandingLayout, AuthLayout } from '@/layout';
import { Toaster } from '@/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <QueryProvider>
          <SocketProvider>
            <Routes>
              {/*  */}
              <Route path='/' Component={LandingLayout}>
                <Route index Component={LandingPage} />
              </Route>
              {/*  */}
              {/* <Route Component={BoardLayout} path='/board'> */}
              <Route Component={ExplorePage} path='/explore' />
              {/*  */}
              <Route path='/rooms/:roomId' Component={RoomLayout}>
                <Route path='channels/:channelId' Component={ChannelPage} />
                <Route path='conversations/:memberId' Component={ConversationPage} />
              </Route>
              <Route path='/auth' Component={AuthLayout}>
                <Route path='login' Component={LoginPage} />
                <Route path='register' Component={RegisterPage} />
              </Route>
              {/* </Route> */}
              {/*  */}
              <Route path='*' Component={ErrorPage} />
            </Routes>
            <ModalProvider />
            <Toaster />
          </SocketProvider>
        </QueryProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
