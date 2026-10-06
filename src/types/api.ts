import type {
  CommentResponse,
  CurrentUserResponse,
  PostResponse,
  ProfileResponse,
} from "./models";

export interface ApiError {
  error?: string;
  message?: string;
  errors?: { msg?: string }[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
}

export interface SignUpRequest extends LoginRequest {
  displayName: string;
  confirmPassword: string;
}

export interface RealtimeTicketResponse {
  ticket: string;
}

export interface CreatePostRequest {
  content: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface LikePostRequest {
  postID: number;
}

export interface LikeCommentRequest {
  commentID: number;
}

export interface ChangeFollowingRequest {
  contactId: number;
}

export type InitialDataResponse =
  | [
      CurrentUserResponse,
      ProfileResponse[],
      ProfileResponse[],
      ProfileResponse[],
      PostResponse[],
      PostResponse[],
      PostResponse[],
      PostResponse[],
      PostResponse[],
    ]
  | ApiError;

export type FeedResponse = PostResponse[];
export type CommentsResponse = CommentResponse[];
