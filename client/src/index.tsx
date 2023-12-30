import 'unfonts.css';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider, QueryProvider, ThemeProvider } from '@/context';
import {
  LandingPage,
  ExplorePage,
  ErrorPage,
  ChannelPage,
  ConversationPage,
  LoginPage,
  RegisterPage,
  MyRoomsPage,
  FirstRoomPage,
  RoomRedirectPage,
  AudioPage

} from '@/pages';
import {
  LandingLayout,
  NoAuthLayout,
  ProtectedLayout,
  NavigationLayout,
  RoomLayout,
  ExploreLayout,
} from '@/layout';
import { Toaster } from '@/components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route Component={LandingLayout}>
              <Route index Component={LandingPage} />
            </Route>
            <Route Component={ProtectedLayout}>
              <Route path='explore' Component={ExploreLayout}>
                <Route index Component={ExplorePage} />
              </Route>
              <Route path='my-rooms' Component={MyRoomsPage} />
              <Route path='first-room' Component={FirstRoomPage} />
              <Route path='rooms' Component={NavigationLayout}>
                <Route path=':roomId' Component={RoomLayout}>
                  <Route index Component={RoomRedirectPage} />
                  <Route path='groups/:groupId' Component={ChannelPage} />
                  <Route path='audiogroups/:groupId' Component={AudioPage} />
                  <Route path='conversations/:memberId' Component={ConversationPage} />
                </Route>
              </Route>
            </Route>

            <Route Component={NoAuthLayout}>
              <Route path='login' Component={LoginPage} />
              <Route path='register' Component={RegisterPage} />
            </Route>
          </Route>
          <Route path='/error-page' Component={ErrorPage} />
          <Route path='*' Component={ErrorPage} />
        </Routes>
        <ModalProvider />
      </BrowserRouter>
      <Toaster />
    </QueryProvider>
  </ThemeProvider>,
);
