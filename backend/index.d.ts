import type { IUser } from "./src/models/user.model";
import type {IDriver} from "./src/models/driver.model"

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      driver?: IDriver;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    user?: IUser;
  }
}
