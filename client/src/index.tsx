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
  AudioPage,
  ForgotPage,
  ResetPage,
  InvitePage,
  NotMemberPage,
} from '@/pages';
import {
  LandingLayout,
  RoomLayout,
  ExploreLayout,
  NoAuthLayout,
  ProtectedLayout,
  NavigationLayout,
  PersistAuthLayout,
} from '@/layout';
import { Toaster } from '@/components/ui/toaster';
import AudioPageTest from './pages/AudioPageTest';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path='/'>
            <Route Component={LandingLayout}>
              <Route index Component={LandingPage} />
            </Route>

            {/* Require Auth */}
            <Route Component={PersistAuthLayout}>
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
                    <Route path='audiogroups/:groupId' Component={AudioPageTest} />
                    <Route path='conversations/:memberId' Component={ConversationPage} />
                  </Route>
                </Route>
                <Route path='invite/:inviteCode' Component={InvitePage} />
              </Route>

              {/* Require No Auth */}
              <Route Component={NoAuthLayout}>
                <Route path='login' Component={LoginPage} />
                <Route path='register' Component={RegisterPage} />
                <Route path='forgot' Component={ForgotPage} />
                <Route path='reset/:token' Component={ResetPage} />
              </Route>
            </Route>
          </Route>

          {/* Error */}
          <Route path='/error-page' Component={ErrorPage} />
          <Route path='/not-member' Component={NotMemberPage} />
          <Route path='*' Component={ErrorPage} />
        </Routes>
        <ModalProvider />
      </BrowserRouter>
      <Toaster />
    </QueryProvider>
  </ThemeProvider>,
);
