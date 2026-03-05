import styles from "./profileCard.module.css";
import { useContext } from "react";
import { ItemContext } from "../ItemContext";

export function ProfileCard({ profile }) {
  const { followings, changeFollowingStatus } = useContext(ItemContext);

  return (
    <article className={styles.profileCard} key={profile.keyID}>
      <div className={styles.photoSection}>
        <img
          src={profile.photo}
          alt="Profile photo"
          className={styles.profileImg}
        />
        {followings.some((follow) => follow.id === profile.id) ? (
          <span
            className={styles.notFollowingBadge}
            onClick={() => changeFollowingStatus(profile.id)}
          >
            Unfollow
          </span>
        ) : (
          <span
            className={styles.followingBadge}
            onClick={() => changeFollowingStatus(profile.id)}
          >
            follow
          </span>
        )}
      </div>
      <div className={styles.basicInfo}>
        <h2>{profile.displayName}</h2>
        <p>Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
        <p>Bio: {profile.bio}</p>
      </div>
    </article>
  );
}
