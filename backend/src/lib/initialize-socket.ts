import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { events } from "../constants";

export const initializeSocketIO = async (io: Server) => {
  console.log("Socket initialized");
  return io.on("connection", async (socket: Socket) => {
    try {
      console.log("Socket connected:", socket.id);
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.token;

      if (!token) {
        throw new Error("Unauthorized");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const user = await User.findById((decoded as jwt.JwtPayload).id).select(
        "-otp -otp_expiry"
      );
      if (!user) {
        throw new Error("Unauthorized");
      }

      socket.user = user;

      socket.join(user._id.toString());
      socket.emit(events.CLIENT_CONNECT);
      console.log("🙋🏻 A User connected:", user._id);
    } catch (error) {
      console.error(error);
    }
  });
};

export const emitSocketEvent = ({
  req,
  roomId,
  event,
  payload,
}: {
  req: any;
  roomId: string;
  event: string;
  payload: any;
}) => {
  req.app.get("io").in(roomId).emit(event, payload);
};
