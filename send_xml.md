此方法仅适合@zippybee/wechatcore@2.1.13 以上版本 和 @zippybee/wechatcore-v1(该库为 3.9.2.23 仅支持通过 host 连接)

@zippybee/wechatcore: ![npm version](https://img.shields.io/npm/v/@zippybee/wechatcore.svg)

@zippybee/wechatcore-v1: ![npm version](https://img.shields.io/npm/v/@zippybee/wechatcore-v1.svg)

## 使用方法

```javascript
const { Wcferry } = require('@zippybee/wechatcore-v1');
const fs = require('fs');
const path = require('path');

const wcferry = new Wcferry({
  host: '127.0.0.1',
  port: 10086,
});

const send_xml = () => {
  const res = wcferry.send_xml_message(
    path.join(__dirname, './applet.xml'), //xml字符串  从消息中采集一条即可
    'x323423423uio', //微信id
  );
  // res 1 发送成功  0  失败
};

wcferry.start();

send_xml();
```
