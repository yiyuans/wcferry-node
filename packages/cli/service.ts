import Fastify, { FastifyInstance } from 'fastify';
import chalk from 'chalk';
import { PortIsRun, KillPort } from './tool';
import { Wcferry } from '@zippybee/wechatcore';

let wcferryInstance: Wcferry | null = null;
let wcf_port = 10086;
let server: FastifyInstance;

function createServer() {
  const fastify = Fastify();

  fastify.get('/start', async (request, reply) => {
    if (PortIsRun(wcf_port)) {
      return { message: 'Service already started', code: -1 };
    }
    if (!wcferryInstance) {
      return { message: 'Service not started', code: 0 };
    }
    wcferryInstance.start();
    return { message: 'Service started', code: 1 };
  });

  fastify.get('/stop', async (request, reply) => {
    if (!wcferryInstance) {
      return { message: 'Service not started', code: 0 };
    }
    wcferryInstance.stop();
    reply.send({ code: 3, message: 'Service stopping...' });
  });

  fastify.get('/force-stop', async (request, reply) => {
    KillPort(wcf_port);
    KillPort(wcf_port + 1);
    reply.send({ code: 3, message: 'Service stopping...' });
  });

  fastify.get('/restart', async (request, reply) => {
    if (!wcferryInstance) {
      return { message: 'Service not started', code: 0 };
    }
    wcferryInstance.stop();
    wcferryInstance.start();
    reply.send({ message: 'Service restarting...', code: 2 });
  });

  return fastify;
}

export async function startServer(wcf: Wcferry, wcf_port: number) {
  wcferryInstance = wcf;
  wcf_port = wcf_port;
  server = createServer();
  const start = async () => {
    try {
      wcf.start();
      await server.listen({ port: 8001, host: '0.0.0.0' });
      console.log(chalk.green('Server started on port 8001'));
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception:', err);
    restartServer();
  });

  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection:', reason);
    restartServer();
  });
  process.on('SIGINT', async () => {
    if (wcferryInstance) {
      wcferryInstance.stop();
    }
    process.exit(0);
  });

  async function restartServer() {
    console.log('Restarting server...');
    await server.close();
    if (wcferryInstance) {
      startServer(wcferryInstance, wcf_port);
    }
  }

  await start();
}
