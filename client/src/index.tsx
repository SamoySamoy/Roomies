import 'unfonts.css';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider, QueryProvider, SocketProvider, ThemeProvider } from '@/context';
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
  LandingLayout,
  NoAuthLayout,
  ProtectedLayout,
  NavigationLayout,
  RoomLayout,
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
                <Route path='explore' Component={ExplorePage} />
                <Route path='my-rooms' Component={MyRoomsPage} />
                <Route path='first-room' Component={FirstRoomPage} />
                <Route path='rooms' Component={NavigationLayout}>
                  <Route path=':roomId' Component={RoomLayout}>
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
