import { directories } from "../config/directories.js";
import path from "path";
import chalk from "chalk";

export class Controller {
  constructor(request, reply) {
    this.request = request;
    this.reply = reply;
  }

  static async use(controllerName, method) {
    const serviceName = `${controllerName.match(/[A-Z][a-z]+/g)[0]}Service`;
    // prettier-ignore
    const controllerPath = path.join(directories.controllers, `${controllerName}.js`);
    const servicePath = path.join(directories.services, `${serviceName}.js`);
    const ControllerClass = await import(controllerPath);
    let ServiceClass;

    try {
      ServiceClass = await import(servicePath);
    } catch (e) {
      if (e.code === "ERR_MODULE_NOT_FOUND") {
        console.log(
          chalk.yellow(
            `${chalk.bold(
              "Warning"
            )}: A corresponding service file for ${controllerPath} was not found at ${servicePath}`
          )
        );
        ServiceClass = null;
      } else {
        throw new Error(e.message);
      }
    }

    return async (request, reply) => {
      const controller = new ControllerClass[controllerName](request, reply);
      try {
        controller.service = ServiceClass
          ? new ServiceClass[serviceName]()
          : null;
      } catch (err) {
        console.log(
          chalk.yellow(
            `${chalk.bold(
              "Warning"
            )}: '${servicePath}' does not provide an export called '${serviceName}'`
          )
        );
      }

      return controller[method].call(controller);
    };
  }
}
