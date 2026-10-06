export type ProfileKind = "regular" | "guest" | "faker";

export interface Profile {
  id: number;
  userId: number;
  keyID: string;
  createdAt: string;
  displayName: string;
  username: string;
  bio: string;
  type: ProfileKind;
  photo: string;
  followingCount?: number;
  followersCount?: number;
}

export interface Post {
  id: number;
  content: string;
  createdAt: string;
  profileId: number;
  keyID: string;
  likeCount: number;
  commentCount: number;
  profileDisplayName: string;
  profileType: ProfileKind;
  profilePhoto: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  profileId: number;
  postId: number;
  likeCount: number;
  profileDisplayName: string;
  profileType: ProfileKind;
  profilePhoto: string;
}

export interface CurrentUserResponse {
  id: number;
  username: string;
  createdAt: string;
  profilePhoto: string | null;
  profileDisplayName: string | null;
  profileType: ProfileKind | null;
  profileBio: string | null;
  profileID: number | null;
  followingCount: number;
  followersCount: number;
}

export interface ProfileResponse {
  id: number;
  userId: number;
  displayName: string;
  bio: string | null;
  type: ProfileKind;
  createdAt: string;
  profilePhoto: string | null;
}

export interface PostResponse {
  id: number;
  content: string;
  createdAt: string;
  profileId: number;
  likeCount: number;
  commentCount: number;
  profileDisplayName: string;
  profileType: ProfileKind;
  profilePhoto: string | null;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  profileId: number;
  postId: number;
  likeCount: number;
  profileDisplayName: string;
  profileType: ProfileKind;
  profilePhoto: string | null;
}
