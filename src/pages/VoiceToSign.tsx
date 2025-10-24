import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Square, Play, RotateCcw, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { formatTime } from '@/utils/audioUtils';
import type { RecordingState, RecognitionResult } from '@/types/sign-language';

export default function VoiceToSign() {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
  });
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // 检查浏览器是否支持语音识别
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        toast.error('您的浏览器不支持语音识别，请使用Chrome浏览器');
        return;
      }

      // 启动录音（用于播放回放）
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordingState((prev) => ({ ...prev, audioBlob }));
        stream.getTracks().forEach((track) => track.stop());
      };

      // 启动实时语音识别
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.lang = 'zh-CN';
      recognition.continuous = true; // 连续识别
      recognition.interimResults = true; // 显示中间结果

      recognition.onresult = (event: any) => {
        const results = Array.from(event.results);
        const transcript = results
          .map((result: any) => result[0].transcript)
          .join('');
        
        console.log('实时识别:', transcript);
        
        // 只在识别到最终结果时处理
        if (event.results[event.results.length - 1].isFinal) {
          console.log('最终识别结果:', transcript);
          setRecognitionResult({ text: transcript });
          
          // 自动生成手语视频
          generateSignVideo(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('识别错误:', event.error);
        if (event.error !== 'no-speech') {
          toast.error(`识别失败: ${event.error}`);
        }
      };

      mediaRecorder.start();
      recognition.start();
      
      setRecordingState((prev) => ({ ...prev, isRecording: true, duration: 0 }));
      setRecognitionResult(null);
      setVideoUrl(null);

      timerRef.current = setInterval(() => {
        setRecordingState((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);

      toast.success('开始录音和实时识别');
    } catch (error) {
      console.error('录音启动失败:', error);
      toast.error('无法访问麦克风，请检查权限设置');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
      setRecordingState((prev) => ({ ...prev, isRecording: false, isPaused: false }));

      // 停止语音识别
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      toast.success('录音和识别已停止');
    }
  };

  const resetRecording = () => {
    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
    });
    setRecognitionResult(null);
    setVideoUrl(null);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const playAudio = () => {
    if (recordingState.audioBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(recordingState.audioBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const generateSignVideo = (text: string) => {
    // 清理文字：去除标点符号、空格等
    const cleanText = text.replace(/[，。！？、\s,\.!?\-]/g, '').trim();
    
    console.log('原始识别文字:', text);
    console.log('清理后文字:', cleanText);
    
    // Mock数据：根据识别的文字匹配对应的视频
    const videoMap: Record<string, string> = {
      '你好': '/video/hello.mp4',
      '再见': '/video/bye.mp4',
      '谢谢': '/video/thank.mp4',
      '谢谢你': '/video/thank.mp4',
    };

    // 先尝试精确匹配
    let matchedVideo = videoMap[cleanText];
    
    // 如果精确匹配失败，尝试包含匹配
    if (!matchedVideo) {
      for (const [key, value] of Object.entries(videoMap)) {
        if (cleanText.includes(key)) {
          matchedVideo = value;
          console.log('包含匹配成功:', key);
          break;
        }
      }
    }
    
    if (matchedVideo) {
      setVideoUrl(matchedVideo);
      toast.success('手语视频已生成！');
    } else {
      setVideoUrl(null);
      toast.info(`暂无"${cleanText}"的手语视频，目前支持：你好、再见、谢谢`);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            返回首页
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-800">语音转手语</CardTitle>
              <CardDescription className="text-base">
                通过录音输入语音，自动识别并转换为手语视频
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-mono text-purple-600 mb-2">
                      {formatTime(recordingState.duration)}
                    </div>
                    <div className="flex justify-center items-center space-x-2">
                      {recordingState.isRecording && (
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      )}
                      <span className="text-gray-600">
                        {recordingState.isRecording ? '正在录音...' : '准备录音'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {!recordingState.isRecording ? (
                      <Button
                        onClick={startRecording}
                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90"
                      >
                        <Mic className="mr-2 w-5 h-5" />
                        开始录音
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:opacity-90"
                      >
                        <Square className="mr-2 w-5 h-5" />
                        停止录音
                      </Button>
                    )}

                    {recordingState.audioBlob && (
                      <>
                        <Button
                          onClick={playAudio}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90"
                        >
                          <Play className="mr-2 w-5 h-5" />
                          播放
                        </Button>

                        <Button
                          onClick={resetRecording}
                          className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white hover:opacity-90"
                        >
                          <RotateCcw className="mr-2 w-5 h-5" />
                          重新录制
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {recognitionResult && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">识别结果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-4 rounded-lg border border-green-100 mb-3">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        {recognitionResult.text || '未识别到内容'}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(recognitionResult.text);
                        toast.success('已复制到剪贴板');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      复制到剪贴板
                    </Button>
                  </CardContent>
                </Card>
              )}

              {videoUrl && (
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800 flex items-center">
                      <Video className="mr-2 w-5 h-5" />
                      手语视频
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      className="w-full rounded-lg shadow-lg"
                    >
                      您的浏览器不支持视频播放
                    </video>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800">💡 功能说明</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-2">
                  <p>✅ 已实现：实时语音识别 + 手语视频演示</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>使用方法：</p>
                    <p className="pl-4">1. 点击"开始录音"</p>
                    <p className="pl-4">2. 清晰地说出词汇（如：你好）</p>
                    <p className="pl-4">3. 点击"停止录音"</p>
                    <p className="pl-4">4. 系统自动识别并生成手语视频</p>
                    <p className="mt-2">支持的词汇：你好、再见、谢谢</p>
                    <p className="text-xs text-gray-500 mt-2">💡 提示：使用实时语音识别技术，说话清晰度和速度会影响识别准确率</p>
                    <p className="text-xs text-gray-500">推荐使用Chrome或Edge浏览器，识别更准确</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
