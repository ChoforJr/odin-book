import type {
  Comment,
  CommentResponse,
  CurrentUserResponse,
  Post,
  PostResponse,
  Profile,
  ProfileResponse,
} from "../types/models";

const defaultAvatar = "/default-avatar.svg";

function avatarFor(
  type: string | null,
  name: string | null,
  image: string | null,
): string {
  if (type === "guest" && name === "Goku") return "/goku.jpeg";
  if (type === "guest" && name === "Vegeta") return "/vegeta.jpg";
  return image || defaultAvatar;
}

export function normalizeAccount(value: CurrentUserResponse): Profile {
  if (value.profileID === null || value.profileDisplayName === null) {
    throw new Error("The signed-in user does not have a profile.");
  }
  return {
    id: value.profileID,
    userId: value.id,
    keyID: `profile-${value.profileID}`,
    createdAt: value.createdAt,
    displayName: value.profileDisplayName,
    username: value.username,
    bio: value.profileBio ?? "",
    type: value.profileType ?? "regular",
    photo: avatarFor(
      value.profileType,
      value.profileDisplayName,
      value.profilePhoto,
    ),
    followingCount: value.followingCount,
    followersCount: value.followersCount,
  };
}

export function normalizeProfile(value: ProfileResponse): Profile {
  return {
    id: value.id,
    userId: value.userId,
    keyID: `profile-${value.id}`,
    createdAt: value.createdAt,
    displayName: value.displayName,
    username: "",
    bio: value.bio ?? "",
    type: value.type,
    photo: avatarFor(value.type, value.displayName, value.profilePhoto),
  };
}

export function normalizePost(value: PostResponse): Post {
  return {
    ...value,
    keyID: `post-${value.id}`,
    profilePhoto: avatarFor(
      value.profileType,
      value.profileDisplayName,
      value.profilePhoto,
    ),
  };
}

export function normalizeComment(value: CommentResponse): Comment {
  return {
    ...value,
    profilePhoto: avatarFor(
      value.profileType,
      value.profileDisplayName,
      value.profilePhoto,
    ),
  };
}
