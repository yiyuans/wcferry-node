import { wcf } from './proto/wcf';
import { ToPlainType } from './utils';

export type RawMessage = ToPlainType<wcf.WxMsg>;

export class Message {
  constructor(private readonly message: wcf.WxMsg) {}

  get raw(): RawMessage {
    return this.message.toObject() as RawMessage;
  }

  get id() {
    return this.message.id;
  }

  get type() {
    return this.message.type;
  }
  // - get 关键字 : 表示这是一个 getter 方法，用于获取对象的属性值。
  // - 作用 : 提供一个只读属性 isSelf ，返回 this.message.is_self 的值。
  // - 调用方式 : 可以直接像访问属性一样调用，例如 message.isSelf 。
  get isSelf() {
    return this.message.is_self;
  }
  // - 普通方法 : 这是一个普通的方法，需要传入参数 wxid 。
  // - 作用 : 判断消息中是否提到了某个用户（ wxid ）。
  // - 调用方式 : 需要像调用函数一样调用，例如 message.isAt('wxid_123456') 。
  isAt(wxid: string) { // 用于判断消息中是否提到了某个用户（ wxid ）
    if (!this.isGroup) {
      return false;
    }
    if (!new RegExp(`<atuserlist\\>.*(${wxid}).*</atuserlist>`).test(this.xml)) {
      return false;
    }
    if (/@(?:所有人|all|All)/.test(this.message.content)) {
      return false;
    }

    return true;
  }

  get xml() {
    return this.message.xml;
  }

  get isGroup() {
    return this.message.is_group;
  }

  get roomId() {
    return this.message.roomid;
  }

  get content() {
    return this.message.content;
  }

  get sender() {
    return this.message.sender;
  }
}
