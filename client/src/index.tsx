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
  ErrorPage,
  ChannelPage,
  ConversationPage,
  LoginPage,
  RegisterPage,
  MyRoomsPage,
  RoomPreviewPage,
  FirstRoomPage,
  RoomRedirectPage,
} from '@/pages';
import {
  RoomLayout,
  LandingLayout,
  NoAuthLayout,
  ProtectedLayout,
  SingleRoomLayout,
  RoomListLayout,
} from '@/layout';
import { Toaster } from '@/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <QueryProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/'>
              <Route Component={LandingLayout}>
                <Route index Component={LandingPage} />
              </Route>
              <Route path='preview' Component={RoomPreviewPage} />
              <Route Component={ProtectedLayout}>
                <Route path='first-room' Component={FirstRoomPage} />
                <Route path='explore' Component={ExplorePage} />
                <Route path='my-rooms' Component={MyRoomsPage} />
                <Route path='rooms' Component={RoomListLayout}>
                  <Route path=':roomId' Component={SingleRoomLayout}>
                    <Route index Component={RoomRedirectPage} />
                    <Route path='groups/:groupId' Component={ChannelPage} />
                    <Route path='conversations/:memberId' Component={ConversationPage} />
                  </Route>
                </Route>
              </Route>
              <Route Component={NoAuthLayout}>
                <Route path='login' Component={LoginPage} />
                <Route path='register' Component={RegisterPage} />
              </Route>
            </Route>
            <Route path='*' Component={ErrorPage} />
          </Routes>
          <ModalProvider />
        </BrowserRouter>
        <Toaster />
      </SocketProvider>
    </QueryProvider>
  </ThemeProvider>,
);
