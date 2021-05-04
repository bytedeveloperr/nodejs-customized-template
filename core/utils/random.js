import crypto from "crypto";

export const random = {
  id(length = 32) {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(length / 2, (err, buffer) => {
        if (err) reject(err);
        const timestamp = Date.now().toString();
        resolve(`${buffer.toString("hex")}${timestamp}`);
      });
    });
  },
};
