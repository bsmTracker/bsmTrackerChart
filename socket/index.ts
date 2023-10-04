import { Manager, io } from "socket.io-client";

const manager = new Manager(process.env.NEXT_PUBLIC_SERVER_URL, {
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
});

export { manager };
