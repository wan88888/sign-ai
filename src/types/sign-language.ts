// 录音状态
export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
}

// 识别结果
export interface RecognitionResult {
  text: string;
  confidence?: number;
}

// 语音识别API响应
export interface SpeechRecognitionResponse {
  status: number;
  msg: string;
  data: {
    corpus_no: string;
    err_no: number;
    err_msg: string;
    sn: string;
    result: string[];
  };
}

// 文字转语音响应（返回音频流或错误JSON）
export interface TextToSpeechResponse {
  sn?: string;
  err_no?: number;
  err_msg?: string;
  idx?: number;
}
