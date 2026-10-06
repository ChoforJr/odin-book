export interface ServerToClientEvents {
  "feed:invalidate": (payload: { kind: "post" | "comment" | "profile" }) => void;
  "comment:invalidate": (payload: { postId: number }) => void;
  "presence:changed": (payload: { userId: number; isOnline: boolean }) => void;
}

export interface ClientToServerEvents {
  "post:subscribe": (payload: { postId: number }) => void;
  "post:unsubscribe": (payload: { postId: number }) => void;
}
