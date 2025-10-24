import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Video, Volume2, Upload, VideoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function SignToText() {
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [recognizedText, setRecognizedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showSelection, setShowSelection] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleShowSelection = () => {
    setShowSelection(true);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true 
      });
      
      setIsRecording(true);
      setShowSelection(false);
      
      // 延迟设置，确保状态更新后再设置视频流
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true; // 录制时静音，避免回声
          videoRef.current.play().catch(err => {
            console.error('播放失败:', err);
          });
          console.log('摄像头已启动');
        }

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          console.log('录制完成，视频大小:', blob.size);
          
          setVideoFileName('recorded-video.webm');
          
          // 先停止摄像头
          stream.getTracks().forEach(track => track.stop());
          
          // 清除srcObject
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
          
          // 延迟设置录制的视频，确保状态更新
          setTimeout(() => {
            setVideoSource(url);
            
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.src = url;
                
                videoRef.current.onloadedmetadata = () => {
                  console.log('录制视频元数据加载成功');
                  toast.success('录制完成，可以播放查看了');
                };
                
                videoRef.current.onerror = (e) => {
                  console.error('录制视频加载失败:', e);
                };
                
                videoRef.current.load();
                console.log('录制视频已设置，URL:', url);
              }
            }, 100);
          }, 50);
        };

        mediaRecorder.start();
        toast.success('开始录制手语视频，可以看到自己了');
      }, 100);
      
    } catch (error) {
      console.error('录制失败:', error);
      toast.error('无法访问摄像头，请检查权限设置');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('录制完成');
    }
  };

  const handleUploadVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('上传文件:', file.name, '类型:', file.type, '大小:', file.size);
      
      const url = URL.createObjectURL(file);
      setVideoFileName(file.name);
      setShowSelection(false);
      
      // 延迟设置视频源，确保视频元素已经渲染
      setTimeout(() => {
        setVideoSource(url);
        
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.src = url;
            
            // 添加事件监听确保视频加载成功
            videoRef.current.onloadedmetadata = () => {
              console.log('视频元数据加载成功');
              toast.success('视频上传成功，可以播放了');
            };
            
            videoRef.current.onerror = (e) => {
              console.error('视频加载失败:', e);
              toast.error('视频加载失败，请尝试其他视频');
            };
            
            videoRef.current.load();
            console.log('视频元素已设置，开始加载');
          } else {
            console.error('视频元素不存在');
          }
        }, 100);
      }, 50);
      
      toast.success('视频文件已选择');
    }
  };

  const handleRecognizeSign = async () => {
    if (!videoSource) {
      toast.error('请先录制或上传手语视频');
      return;
    }

    setIsProcessing(true);
    toast.info('正在识别手语...');

    // Mock数据：根据视频文件名识别对应的手语内容
    setTimeout(async () => {
      // 文件名映射表
      const videoTextMap: Record<string, string> = {
        'hello.mp4': '你好',
        'thank.mp4': '谢谢',
        'bye.mp4': '再见',
        'eat.mp4': '吃饭',
        'sleep.mp4': '睡觉',
        'love.mp4': '我爱你',
        'data1.mp4': '接天莲叶无穷碧,映日荷花别样红',
        'data2.mp4': '向浅洲远渚亭亭清绝',
        'data3.mp4': '黄梅时节家家雨,青草池塘处处蛙',
      };

      // 根据文件名查找对应的文字
      let recognizedTextResult = videoTextMap[videoFileName] || videoTextMap[videoFileName.toLowerCase()];
      
      // 如果没有匹配，尝试部分匹配
      if (!recognizedTextResult) {
        for (const [key, value] of Object.entries(videoTextMap)) {
          if (videoFileName.toLowerCase().includes(key.toLowerCase().replace('.mp4', ''))) {
            recognizedTextResult = value;
            break;
          }
        }
      }
      
      // 如果还是没有匹配，使用默认值
      if (!recognizedTextResult) {
        recognizedTextResult = '你好';
        toast.warning('未识别到对应的手语，使用默认值');
      }
      
      console.log('识别文件名:', videoFileName);
      console.log('识别结果:', recognizedTextResult);
      
      setRecognizedText(recognizedTextResult);
      toast.success('手语识别成功！');
      
      // 使用浏览器原生 Speech Synthesis API 生成语音
      try {
        // 检查浏览器是否支持语音合成
        if ('speechSynthesis' in window) {
          // 设置一个标记，表示语音已准备好
          setAudioUrl('ready');
          toast.success('语音合成成功！点击播放按钮可以听到语音');
        } else {
          toast.warning('您的浏览器不支持语音合成功能');
        }
      } catch (error) {
        console.error('语音合成失败:', error);
        toast.error('语音合成失败');
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const handlePlayAudio = () => {
    if (audioUrl && recognizedText) {
      // 使用浏览器原生 Speech Synthesis API 播放语音
      if ('speechSynthesis' in window) {
        // 停止当前正在播放的语音
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(recognizedText);
        utterance.lang = 'zh-CN'; // 设置为中文
        utterance.rate = 0.9; // 语速（0.1 到 10，默认 1）
        utterance.pitch = 1; // 音调（0 到 2，默认 1）
        utterance.volume = 1; // 音量（0 到 1，默认 1）
        
        utterance.onstart = () => {
          toast.info('开始播放语音...');
        };
        
        utterance.onend = () => {
          console.log('语音播放完成');
        };
        
        utterance.onerror = (event) => {
          console.error('语音播放错误:', event);
          toast.error('语音播放失败');
        };
        
        window.speechSynthesis.speak(utterance);
      } else {
        toast.error('您的浏览器不支持语音合成功能');
      }
    }
  };

  const handleReset = () => {
    // 停止当前正在播放的语音
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setVideoSource(null);
    setVideoFileName('');
    setRecognizedText('');
    setAudioUrl(null);
    setShowSelection(false);
    setIsRecording(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = '';
      videoRef.current.onloadedmetadata = null;
      videoRef.current.onerror = null;
      videoRef.current.load();
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
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4">
                <Video className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-800">手语转文字语音</CardTitle>
              <CardDescription className="text-base">
                录制手语视频，识别手语动作并转换为文字和语音
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 视频录制/上传区域 - 缩小尺寸 */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-lg text-orange-800">📹 手语视频</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-w-md mx-auto">
                    {!videoSource && !isRecording ? (
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center text-gray-500">
                          <Video className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-base font-medium">点击下方按钮开始</p>
                        </div>
                      </div>
                    ) : (
                      <video
                        ref={videoRef}
                        className="w-full aspect-video bg-black rounded-lg"
                        controls={!isRecording}
                        playsInline
                        muted={isRecording}
                        autoPlay={isRecording}
                      >
                        您的浏览器不支持视频播放
                      </video>
                    )}

                    <div className="mt-4 space-y-3">
                      {!videoSource && !isRecording && !showSelection && (
                        <Button
                          onClick={handleShowSelection}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90 py-6 text-lg"
                        >
                          <Video className="mr-2 w-5 h-5" />
                          开始
                        </Button>
                      )}

                      {showSelection && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={handleStartRecording}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90 py-6"
                          >
                            <VideoIcon className="mr-2 w-5 h-5" />
                            录像
                          </Button>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 py-6"
                          >
                            <Upload className="mr-2 w-5 h-5" />
                            上传视频
                          </Button>
                        </div>
                      )}

                      {isRecording && (
                        <Button
                          onClick={handleStopRecording}
                          className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:opacity-90 py-6"
                        >
                          停止录制
                        </Button>
                      )}

                      {videoSource && !isRecording && (
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            onClick={handleRecognizeSign}
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 py-6"
                          >
                            {isProcessing ? '识别中...' : '开始识别'}
                          </Button>
                          <Button
                            onClick={handleReset}
                            variant="outline"
                            className="py-6"
                          >
                            重新录制
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleUploadVideo}
                    className="hidden"
                  />
                </CardContent>
              </Card>

              {/* 识别结果 */}
              {recognizedText && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">识别结果</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-4 rounded-lg border border-green-100 mb-4">
                      <p className="text-gray-800 text-2xl font-medium text-center">
                        {recognizedText}
                      </p>
                    </div>
                    
                    {audioUrl && (
                      <Button
                        onClick={handlePlayAudio}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90 py-6 text-lg"
                      >
                        <Volume2 className="mr-2 w-5 h-5" />
                        播放语音
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 功能说明 */}
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800">💡 功能说明</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-2">
                  <p>✅ 已实现：Mock识别演示 + 浏览器原生语音合成</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>使用方法：</p>
                    <p className="pl-4">1. 点击"开始"按钮</p>
                    <p className="pl-4">2. 选择"录像"或"上传视频"</p>
                    <p className="pl-4">3. 完成后点击"开始识别"</p>
                    <p className="pl-4">4. 系统根据文件名识别并生成文字</p>
                    <p className="pl-4">5. 自动使用浏览器原生 TTS 合成语音</p>
                    <p className="pl-4">6. 点击"播放语音"播报识别结果</p>
                    
                    <p className="mt-2 font-medium">支持的视频文件：</p>
                    <p className="pl-4">hello.mp4 → 你好</p>
                    <p className="pl-4">thank.mp4 → 谢谢</p>
                    <p className="pl-4">bye.mp4 → 再见</p>
                    <p className="pl-4">eat.mp4 → 吃饭</p>
                    <p className="pl-4">sleep.mp4 → 睡觉</p>
                    <p className="pl-4">love.mp4 → 我爱你</p>
                    <p className="pl-4">data1.mp4 → 接天莲叶无穷碧,映日荷花别样红</p>
                    <p className="pl-4">data2.mp4 → 向浅洲远渚亭亭清绝</p>
                    <p className="pl-4">data3.mp4 → 黄梅时节家家雨,青草池塘处处蛙</p>
                    
                    <p className="text-xs text-gray-500 mt-2">💡 提示：上传对应文件名的视频可获得准确的识别结果</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
