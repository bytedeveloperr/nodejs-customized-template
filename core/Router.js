import fs from "fs/promises";
import path from "path";
import { directories } from "../config/directories.js";

export class Router {
  constructor() {
    this.routes = [];
  }

  async initialize() {
    const { routes } = this;

    const files = await fs.readdir(directories.routes);

    for (let i = 0; i < files.length; i++) {
      const split = files[i].split(".");
      const ext = split[split.length - 1].toLocaleLowerCase();

      if (ext === "js" && !files[i].startsWith("_")) {
        const module = await import(path.join(directories.routes, files[i]));
        const route = {
          path: split[0] == "index" ? "/" : `/${split[0]}`,
          handler: module.default || module.route,
        };

        routes.push(route);
      }
    }
  }

  async mount(server) {
    const { routes } = this;

    for (let i = 0; i < routes.length; i++) {
      server.register(routes[i].handler, {
        prefix: routes[i].path,
      });

      delete routes[i];
    }
  }
}
