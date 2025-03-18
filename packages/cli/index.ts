import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { startServer } from './service';
import { Command } from 'commander';
import { KillPort, PortIsRun, openWeChat } from './tool';
import * as pkg from './package.json';
import { Wcferry } from '@zippybee/wechatcore';
const program = new Command();
let wcferryInstance: any = null; // 用于存储 Wcferry 实例
program.version(pkg.version, '-v --version').usage('<command> [options]');

program
  .command('start')
  .description('start of wcf')
  .option('-p, --port <port>', 'set WCF SERVER PORT, default is 10086', '10086')
  .option('-d, --dir <dir>', 'WCF DLL PATH', '')
  .option('-w, --wechat_dir <wechat_dir>', 'set the WeChat directory', '')
  .option('-f, --fontend <fontend>', 'Is the program running in the foreground')
  .action(async (options) => {
    if (PortIsRun(+options.port || 10086)) {
      console.log(chalk.yellow('WCF service is already running.'));
      return;
    }

    wcferryInstance = new Wcferry({
      service: true,
      port: +options.port,
      wcf_path: options.dir || '',
      wechat_dir: options.wechat_dir || '',
    });
    fs.writeFileSync(path.join(__dirname, 'wcferry.json'), JSON.stringify({ port: +options.port || 10086 }));
    if (options.fontend) {
      await startServer(wcferryInstance, +options.port || 10086);
      return;
    }
    wcferryInstance.start();
    console.log(chalk.green(`WCF is Running on port: ${options.port || 10086}`));
  });

program
  .command('stop')
  .description('stop of wcf')
  .option('-p, --port <port>', 'WCF RUNING IS PORT', '10086')
  .option('-r, --restart', 'IS RESTART WECHAT')
  .action((options) => {
    let port = 10086;
    const configpath = path.join(__dirname, 'wcferry.json');
    if (fs.existsSync(configpath)) {
      const config = fs.readFileSync(path.join(__dirname, 'wcferry.json'), 'utf-8');
      const setting = JSON.parse(config || '{}');
      port = setting.port;
    }
    if (options.port) {
      port = +options.port;
    }
    const socket_port = port + 1;
    KillPort(port);
    KillPort(socket_port);
    if (options.restart) {
      openWeChat();
    }
  });

program.parse(process.argv);
