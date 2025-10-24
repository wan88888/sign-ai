import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic, Video, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: MessageSquare,
      title: '文字转手语',
      description: '输入文字内容，系统自动生成对应的手语视频演示',
      path: '/text-to-sign',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Mic,
      title: '语音转手语',
      description: '通过录音输入语音，自动识别并转换为手语视频',
      path: '/voice-to-sign',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Video,
      title: '手语转文字语音',
      description: '录制手语视频，识别手语动作并转换为文字和语音',
      path: '/sign-to-text',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">SignAI</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">为听障人士打造的无障碍交流平台，提供文字、语音与手语之间的实时双向翻译服务</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 whitespace-nowrap overflow-hidden">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to={feature.path}>
                    <Button
                      className={`w-full bg-gradient-to-r ${feature.color} text-white hover:opacity-90 transition-opacity`}
                    >
                      开始使用
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-5xl mx-auto border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-800">
                关于SignAI
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 space-y-4">
              <p>SignAI致力于消除听障人士与健听人士之间的沟通障碍，通过先进的AI技术，实现文字、语音和手语之间的无缝转换。</p>
              <p>我们的目标是让每一个人都能自由表达，让沟通变得更加简单和温暖。</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
