// 将WebM格式转换为WAV格式（16000Hz采样率）
export const convertWebmToWav = async (webmBlob: Blob): Promise<Blob> => {
  const audioContext = new AudioContext({ sampleRate: 16000 });
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const resampledBuffer = resampleAudioBuffer(audioBuffer, 16000);
  const wavBlob = audioBufferToWav(resampledBuffer);
  return wavBlob;
};

// 重采样音频缓冲区
const resampleAudioBuffer = (audioBuffer: AudioBuffer, targetSampleRate: number): AudioBuffer => {
  const sourceSampleRate = audioBuffer.sampleRate;
  const ratio = sourceSampleRate / targetSampleRate;
  const newLength = Math.round(audioBuffer.length / ratio);
  
  const audioContext = new AudioContext({ sampleRate: targetSampleRate });
  const newBuffer = audioContext.createBuffer(1, newLength, targetSampleRate);
  
  const sourceData = audioBuffer.getChannelData(0);
  const newData = newBuffer.getChannelData(0);
  
  for (let i = 0; i < newLength; i++) {
    const sourceIndex = Math.round(i * ratio);
    newData[i] = sourceData[sourceIndex] || 0;
  }
  
  return newBuffer;
};

// 将音频缓冲区转换为WAV格式
const audioBufferToWav = (buffer: AudioBuffer): Blob => {
  const length = buffer.length;
  const arrayBuffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(arrayBuffer);
  const channels = 1;
  const sampleRate = buffer.sampleRate;
  
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, length * 2, true);
  
  const channelData = buffer.getChannelData(0);
  let offset = 44;
  for (let i = 0; i < length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]));
    view.setInt16(offset, sample * 0x7FFF, true);
    offset += 2;
  }
  
  return new Blob([arrayBuffer], { type: 'audio/wav' });
};

// 将Blob转换为Base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// 生成唯一的客户端ID
export const generateCUID = (): string => {
  return 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// 格式化时间（秒转为 MM:SS 格式）
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
