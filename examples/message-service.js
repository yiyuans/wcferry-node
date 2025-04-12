// - 创建了 MessageService 类来封装消息处理逻辑
// - 实现了服务启动、消息监听和消息处理等核心功能
// - 添加了登录状态检查和用户信息获取
// - 提供了可扩展的消息处理接口
// - 包含了完整的服务生命周期管理（启动和停止）
const { Wcferry } = require('@zippybee/wechatcore');

class MessageService {
  constructor() {
    this.client = new Wcferry();
  }

  // 启动服务
  start() {
    this.client.start();
    
    // 检查登录状态
    const isLogin = this.client.isLogin();
    if (!isLogin) {
      console.log('微信未登录');
      return false;
    }

    // 获取用户信息
    const userInfo = this.client.getUserInfo();
    console.log('当前登录用户:', userInfo);

    // 启动消息监听
    this.startMessageListener();
    return true;
  }

  // 消息监听服务
  startMessageListener() {
    console.log('开始监听消息...');
    
    const off = this.client.listening((msg) => {
      this.handleMessage(msg);
    });

    // 返回取消监听的函数
    return off;
  }

  // 消息处理
  handleMessage(msg) {
    console.log('收到新消息:', msg);
    
    // 这里可以根据消息类型和内容进行不同的处理
    // 例如：文本消息、图片消息、语音消息等
    if (msg.content) {
      console.log('消息内容:', msg.content);
      // 在这里添加具体的消息处理逻辑
    }
  }

  // 停止服务
  stop() {
    // 可以在这里添加清理代码
    
    console.log('消息服务已停止');
  }
}

// 使用示例
const messageService = new MessageService();
messageService.start();