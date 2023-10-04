import { User } from "./user";

export type ChartTrackSk = {
  id: number;
  code: string;
  name: string;
  image: string;
  duration_ms: number;
  userId: number;
  user: User;
  likeCount: number;
  createdAt: Date;
};

export type ChartTrack = {
  code: string;
  name: string;
  image: string;
  duration_ms: number;
  createdAt: Date;
};
