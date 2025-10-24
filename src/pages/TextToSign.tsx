import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MessageSquare, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function TextToSign() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleTextToSignVideo = async () => {
    if (!text.trim()) {
      toast.error('请输入文字内容');
      return;
    }

    setIsProcessing(true);
    
    // Mock数据：根据输入文字匹配对应的视频
    const videoMap: Record<string, string> = {
      '你好': '/video/hello.mp4',
      '谢谢你': '/video/thank.mp4',
      '吃饭': '/video/eat.mp4',
      '我爱你': '/video/love.mp4',
      '再见': '/video/bye.mp4',
      '睡觉': '/video/sleep.mp4',
      '接天莲叶无穷碧,映日荷花别样红': '/video/data1.mp4',
      '向浅洲远渚亭亭清绝': '/video/data2.mp4',
      '黄梅时节家家雨,青草池塘处处蛙': '/video/data3.mp4',
    };

    setTimeout(() => {
      const matchedVideo = videoMap[text.trim()];
      
      if (matchedVideo) {
        setVideoUrl(matchedVideo);
        toast.success('手语视频生成成功！');
      } else {
        toast.error('暂不支持该文字的手语视频，请查看功能说明中支持的词汇列表');
      }
      
      setIsProcessing(false);
    }, 500);
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
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-800">文字转手语</CardTitle>
              <CardDescription className="text-base">
                输入文字内容，系统将生成对应的手语视频
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  请输入文字内容（最多30字）
                </label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="在这里输入您想要转换的文字..."
                  className="min-h-[200px] text-base resize-none"
                  maxLength={30}
                />
                <div className="text-right text-sm text-gray-500 mt-2">
                  {text.length} / 30
                </div>
              </div>

              <Button
                onClick={handleTextToSignVideo}
                disabled={!text.trim() || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90 py-6 text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    处理中...
                  </div>
                ) : (
                  <>
                    <Video className="mr-2 w-5 h-5" />
                    生成手语视频
                  </>
                )}
              </Button>

              {videoUrl && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800 flex items-center">
                      <Video className="mr-2 w-5 h-5" />
                      手语视频已生成
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
                  <CardTitle className="text-lg text-amber-800">
                    💡 功能说明
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 space-y-3">
                  <p>✅ 已实现：Mock数据演示</p>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p className="font-medium">日常用语：</p>
                    <p className="pl-4">你好、谢谢你、再见、吃饭、睡觉、我爱你</p>
                    <p className="font-medium">古诗词：</p>
                    <p className="pl-4">接天莲叶无穷碧,映日荷花别样红</p>
                    <p className="pl-4">向浅洲远渚亭亭清绝</p>
                    <p className="pl-4">黄梅时节家家雨,青草池塘处处蛙</p>
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
