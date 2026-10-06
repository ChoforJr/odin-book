"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { apiRequest, jsonBody } from "../lib/api";
import {
  normalizeAccount,
  normalizeComment,
  normalizePost,
  normalizeProfile,
} from "../lib/normalize";
import type {
  ChangeFollowingRequest,
  CommentsResponse,
  CreateCommentRequest,
  CreatePostRequest,
  InitialDataResponse,
  LikeCommentRequest,
  LikePostRequest,
  RealtimeTicketResponse,
} from "../types/api";
import type { ClientToServerEvents, ServerToClientEvents } from "../types/realtime";
import type { Comment, Post, Profile } from "../types/models";

interface AppContextValue {
  account: Profile | null;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
  live: boolean;
  homePosts: Post[];
  trendingPosts: Post[];
  myPosts: Post[];
  likedPosts: Post[];
  commentedPosts: Post[];
  followings: Profile[];
  followers: Profile[];
  exploreProfiles: Profile[];
  onlineUserIds: ReadonlySet<number>;
  commentRevision: number;
  clearError: () => void;
  refreshData: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  createPost: (content: string) => Promise<void>;
  togglePostLike: (postId: number) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  followProfile: (contactId: number) => Promise<void>;
  updateProfile: (field: "displayName" | "bio" | "userName", value: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmNewPassword: string) => Promise<void>;
  uploadPhoto: (file: File) => Promise<void>;
  deleteAccount: () => Promise<void>;
  getComments: (postId: number) => Promise<Comment[]>;
  createComment: (postId: number, content: string) => Promise<void>;
  toggleCommentLike: (commentId: number) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [account, setAccount] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homePosts, setHomePosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [commentedPosts, setCommentedPosts] = useState<Post[]>([]);
  const [followings, setFollowings] = useState<Profile[]>([]);
  const [followers, setFollowers] = useState<Profile[]>([]);
  const [exploreProfiles, setExploreProfiles] = useState<Profile[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(() => new Set());
  const [live, setLive] = useState(false);
  const [commentRevision, setCommentRevision] = useState(0);

  const runRequest = useCallback(async <T,>(request: () => Promise<T>): Promise<T> => {
    setError(null);
    try {
      return await request();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The request failed.");
      throw requestError;
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiRequest<InitialDataResponse>("/initialData");
      if (!Array.isArray(result) || result.length !== 9) {
        throw new Error("The server returned an invalid initial-data response.");
      }
      const [
        user,
        rawFollowings,
        rawFollowers,
        rawExploreProfiles,
        rawHomePosts,
        rawTrendingPosts,
        rawMyPosts,
        rawLikedPosts,
        rawCommentedPosts,
      ] = result;
      setAccount(normalizeAccount(user));
      setFollowings(rawFollowings.map(normalizeProfile));
      setFollowers(rawFollowers.map(normalizeProfile));
      setExploreProfiles(rawExploreProfiles.map(normalizeProfile));
      setHomePosts(rawHomePosts.map(normalizePost));
      setTrendingPosts(rawTrendingPosts.map(normalizePost));
      setMyPosts(rawMyPosts.map(normalizePost));
      setLikedPosts(rawLikedPosts.map(normalizePost));
      setCommentedPosts(rawCommentedPosts.map(normalizePost));
      setError(null);
    } catch (requestError) {
      setAccount(null);
      setHomePosts([]);
      setTrendingPosts([]);
      setMyPosts([]);
      setLikedPosts([]);
      setCommentedPosts([]);
      setFollowings([]);
      setFollowers([]);
      setExploreProfiles([]);
      setOnlineUserIds(new Set());
      if (requestError instanceof Error && "status" in requestError && requestError.status === 401) {
        setError(null);
      } else if (requestError instanceof Error) {
        setError(requestError.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const signedInUserId = account?.id;

  useEffect(() => {
    const apiOrigin = process.env.NEXT_PUBLIC_API_URL;
    if (!signedInUserId || !apiOrigin) return;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(apiOrigin, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 8_000,
      auth: (done) => {
        void apiRequest<RealtimeTicketResponse>("/realtime-ticket")
          .then(({ ticket }) => done({ ticket }))
          .catch(() => done({}));
      },
    });

    socket.on("connect", () => setLive(true));
    socket.on("disconnect", () => setLive(false));
    socket.on("connect_error", () => setLive(false));
    socket.on("feed:invalidate", ({ kind }) => {
      void refreshData();
      if (kind === "comment") {
        setCommentRevision((revision) => revision + 1);
      }
    });
    socket.on("comment:invalidate", () => setCommentRevision((revision) => revision + 1));
    socket.on("presence:changed", ({ userId, isOnline }) => {
      setOnlineUserIds((current) => {
        const next = new Set(current);
        if (isOnline) next.add(userId);
        else next.delete(userId);
        return next;
      });
    });
    socket.connect();

    return () => {
      socket.disconnect();
      setLive(false);
    };
  }, [signedInUserId, refreshData]);

  const login = useCallback(async (username: string, password: string) => {
    await runRequest(async () => {
      await apiRequest("/login", {
        method: "POST",
        body: jsonBody({ username, password }),
      });
      await refreshData();
    });
  }, [refreshData, runRequest]);

  const signup = useCallback(async (
    username: string,
    password: string,
    displayName: string,
  ) => {
    await runRequest(async () => {
      await apiRequest("/signup", {
        method: "POST",
        body: jsonBody({ username, password, displayName, confirmPassword: password }),
      });
      await apiRequest("/login", {
        method: "POST",
        body: jsonBody({ username, password }),
      });
      await refreshData();
    });
  }, [refreshData, runRequest]);

  const logout = useCallback(async () => {
    await runRequest(async () => {
      await apiRequest("/logout", { method: "POST" });
      setAccount(null);
      setOnlineUserIds(new Set());
      setHomePosts([]);
      setTrendingPosts([]);
      setMyPosts([]);
      setLikedPosts([]);
      setCommentedPosts([]);
      setFollowings([]);
      setFollowers([]);
      setExploreProfiles([]);
    });
  }, [runRequest]);

  const createPost = useCallback(async (content: string) => {
    await runRequest(async () => {
      const payload: CreatePostRequest = { content };
      await apiRequest("/post/textOnly", { method: "POST", body: jsonBody(payload) });
      await refreshData();
    });
  }, [refreshData, runRequest]);

  const togglePostLike = useCallback(async (postId: number) => {
    await runRequest(async () => {
      const payload: LikePostRequest = { postID: postId };
      await apiRequest("/post/like", { method: "PATCH", body: jsonBody(payload) });
      await refreshData();
    });
  }, [refreshData, runRequest]);

  const deletePost = useCallback(async (postId: number) => {
    await runRequest(async () => {
      await apiRequest(`/post/${postId}`, { method: "DELETE" });
      await refreshData();
    });
  }, [refreshData, runRequest]);

  const followProfile = useCallback(async (contactId: number) => {
    await runRequest(async () => {
      const payload: ChangeFollowingRequest = { contactId };
      await apiRequest("/user/profile/change/following", {
        method: "PATCH",
        body: jsonBody(payload),
      });
      await refreshData();
    });
  }, [refreshData, runRequest]);

  const updateProfile = useCallback(async (
    field: "displayName" | "bio" | "userName",
    value: string,
  ) => {
    const bodyKey = field === "displayName" ? "newDisplayName" :
      field === "bio" ? "newBio" : "newUsername";
    await runRequest(async () => {
      await apiRequest(`/user/self/${field}`, {
        method: "PATCH",
        body: jsonBody({ [bodyKey]: value }),
      });
      await refreshData();
    });
  }, [refreshData, runRequest]);

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => {
    await runRequest(() => apiRequest("/user/self/password", {
      method: "PATCH",
      body: jsonBody({ currentPassword, newPassword, confirmNewPassword }),
    }));
  }, [runRequest]);

  const uploadPhoto = useCallback(async (file: File) => {
    await runRequest(async () => {
      const formData = new FormData();
      formData.append("uploads", file);
      await apiRequest("/user/change/profile/photo", {
        method: "PATCH",
        body: formData,
      });
      await refreshData();
    });
  }, [refreshData, runRequest]);

  const deleteAccount = useCallback(async () => {
    await runRequest(async () => {
      await apiRequest("/user/self", { method: "DELETE" });
      await apiRequest("/logout", { method: "POST" });
      setAccount(null);
      setHomePosts([]);
    });
  }, [runRequest]);

  const getComments = useCallback(async (postId: number) => {
    const comments = await apiRequest<CommentsResponse>(`/comment/${postId}`);
    return comments.map(normalizeComment);
  }, []);

  const createComment = useCallback(async (postId: number, content: string) => {
    await runRequest(async () => {
      const payload: CreateCommentRequest = { content };
      await apiRequest(`/comment/${postId}`, {
        method: "POST",
        body: jsonBody(payload),
      });
      setCommentRevision((revision) => revision + 1);
    });
  }, [runRequest]);

  const toggleCommentLike = useCallback(async (commentId: number) => {
    await runRequest(async () => {
      const payload: LikeCommentRequest = { commentID: commentId };
      await apiRequest("/comment/like", { method: "PATCH", body: jsonBody(payload) });
      setCommentRevision((revision) => revision + 1);
    });
  }, [runRequest]);

  const deleteComment = useCallback(async (commentId: number) => {
    await runRequest(async () => {
      await apiRequest(`/comment/${commentId}`, { method: "DELETE" });
      setCommentRevision((revision) => revision + 1);
    });
  }, [runRequest]);

  const value = useMemo<AppContextValue>(() => ({
    account,
    authenticated: account !== null,
    loading,
    error,
    live,
    homePosts,
    trendingPosts,
    myPosts,
    likedPosts,
    commentedPosts,
    followings,
    followers,
    exploreProfiles,
    onlineUserIds,
    commentRevision,
    clearError: () => setError(null),
    refreshData,
    login,
    signup,
    logout,
    createPost,
    togglePostLike,
    deletePost,
    followProfile,
    updateProfile,
    changePassword,
    uploadPhoto,
    deleteAccount,
    getComments,
    createComment,
    toggleCommentLike,
    deleteComment,
  }), [
    account,
    loading,
    error,
    live,
    homePosts,
    trendingPosts,
    myPosts,
    likedPosts,
    commentedPosts,
    followings,
    followers,
    exploreProfiles,
    onlineUserIds,
    commentRevision,
    refreshData,
    login,
    signup,
    logout,
    createPost,
    togglePostLike,
    deletePost,
    followProfile,
    updateProfile,
    changePassword,
    uploadPhoto,
    deleteAccount,
    getComments,
    createComment,
    toggleCommentLike,
    deleteComment,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used within AppProvider.");
  return value;
}
