import Fastify from "fastify";
import { app } from "../config/app.js";
import { fastify } from "../config/fastify.js";
import { Router } from "./Router.js";
import "./_global.js";
import { plugins } from "../config/plugins.js";

export class Application {
  constructor(options = null) {
    this.plugins = [...plugins];
    this.server = Fastify({ ...fastify, ...options });
  }

  async plugin(plugin) {
    this.plugins.push(plugin);
  }

  setErrorHandler(handler) {
    return this.server.setErrorHandler(handler);
  }

  async bootstrap() {
    const { server, plugins } = this;
    const router = new Router();

    await router.initialize();
    await router.mount(this.server);

    for (let i = 0; i < plugins.length; i++) {
      server.register(
        plugins[i]["main"] || plugins[i],
        plugins[i]["options"] || {}
      );
      delete plugins[i];
    }
  }

  async listen(port, host) {
    return new Promise((resolve, _reject) => {
      resolve(this.server.listen(port || app.port, host || app.host));
    }).catch((e) => {
      throw new Error(
        `An error occured while trying to start server: ${e.message}`
      );
    });
  }
}
