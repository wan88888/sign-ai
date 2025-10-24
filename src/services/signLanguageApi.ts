import axios from 'axios';
import type { SpeechRecognitionResponse } from '@/types/sign-language';
import { generateCUID } from '@/utils/audioUtils';

const APP_ID = import.meta.env.VITE_APP_ID;

const apiClient = axios.create({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Id': APP_ID,
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API 请求错误:', error);
    if (error.response?.data?.status === 999) {
      throw new Error(error.response.data.msg);
    }
    return Promise.reject(error);
  }
);

// 语音识别API
export const recognizeSpeech = async (
  audioBase64: string,
  audioLength: number
): Promise<SpeechRecognitionResponse> => {
  const payload = {
    format: 'wav',
    rate: 16000,
    cuid: generateCUID(),
    speech: audioBase64,
    len: audioLength,
  };

  return apiClient.post(
    '/api/miaoda/runtime/apicenter/source/proxy/mq1kwYXAVMdchUVFf1kt3D',
    payload
  );
};

// 文字转语音API
export const textToSpeech = async (text: string): Promise<Blob> => {
  const APP_ID = import.meta.env.VITE_APP_ID;
  
  const params = new URLSearchParams({
    tex: encodeURIComponent(text),
    cuid: generateCUID(),
    ctp: '1',
    aue: '3',
    per: '0',
    spd: '5',
    pit: '5',
    vol: '5',
  });

  const response = await axios.post(
    'https://api-eLMl2P4563j9-app-71w5z1brvnk1-integrations.miaoda.cn/text2audio',
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-App-Id': APP_ID,
      },
      responseType: 'blob',
      timeout: 60000,
    }
  );

  if (response.headers['content-type']?.startsWith('audio')) {
    return response.data;
  }
  
  const text_response = await response.data.text();
  const errorData = JSON.parse(text_response);
  throw new Error(errorData.err_msg || '语音合成失败');
};
