import type { IUser } from "./src/models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    user?: IUser;
  }
}
