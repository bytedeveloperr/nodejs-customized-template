import path from "path";

global.use = async (fp) => {
  let module, pth;
  if (typeof fp !== "string") {
    throw new Error("Filepath must only be a string");
  }

  try {
    pth = path.join(path.resolve(), fp.split("/").join(path.sep));
    module = await import(pth);
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
      try {
        module = await import(fp);
      } catch (err) {
        if (err.code === "ERR_MODULE_NOT_FOUND") {
          throw new Error(`Cannot find module '${pth}'`);
        }
        throw new Error(err);
      }
    } else {
      throw new Error(err);
    }
  }

  return module?.default || module;
};
