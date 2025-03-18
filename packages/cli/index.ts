import chalk from 'chalk';
import { Command } from 'commander';
import * as pkg from './package.json';
import { Wcferry } from '@zippybee/wechatcore';
const program = new Command();
let wcferryInstance: any = null; // 用于存储 Wcferry 实例
program.version(pkg.version, '-v --version').usage('<command> [options]');

program
  .command('start')
  .description('start of wcf')
  .option('-p', '--port <port>', 'wcf is running on port')
  .option('-d', '--dir <dir>', 'wcf is running on dir')
  .option('-w', '--wechat_dir <wechat_dir>', 'wechat file dir')
  .action((options) => {
    if (wcferryInstance) {
      console.log(chalk.yellow('WCF service is already running.'));
      return;
    }

    wcferryInstance = new Wcferry({
      service: true,
      port: options.port,
      wcf_path: options.dir || '',
      wechat_dir: options.wechat_dir || '',
    });
    wcferryInstance.start();
    console.log(chalk.green(`WCF is Running on port: ${options.port || 10086}`));
  });

program
  .command('stop')
  .description('stop of wcf')
  .action(() => {
    wcferryInstance = new Wcferry();
    wcferryInstance.stopWcf();
  });

program.parse(process.argv);
