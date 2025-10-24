import Home from './pages/Home';
import TextToSign from './pages/TextToSign';
import VoiceToSign from './pages/VoiceToSign';
import SignToText from './pages/SignToText';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <Home />,
    visible: false,
  },
  {
    name: '文字转手语',
    path: '/text-to-sign',
    element: <TextToSign />,
    visible: false,
  },
  {
    name: '语音转手语',
    path: '/voice-to-sign',
    element: <VoiceToSign />,
    visible: false,
  },
  {
    name: '手语转文字语音',
    path: '/sign-to-text',
    element: <SignToText />,
    visible: false,
  },
];

export default routes;