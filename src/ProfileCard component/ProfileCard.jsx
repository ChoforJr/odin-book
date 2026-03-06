import styles from "./profileCard.module.css";
import { useContext, useCallback } from "react";
import { ItemContext } from "../ItemContext";
import { UserMinus, UserPlus } from "lucide-react";

export function ProfileCard({ profile }) {
  const { followings, changeFollowingStatus } = useContext(ItemContext);

  const isFollowing = followings.some((follow) => follow.id === profile.id);

  const handleFollowToggle = useCallback(() => {
    changeFollowingStatus(profile.id);
  }, [profile.id, changeFollowingStatus]);

  return (
    <article className={styles.profileCard}>
      <div className={styles.photoSection}>
        <img
          src={profile.photo}
          alt={profile.displayName}
          className={styles.profileImg}
        />
      </div>
      <div className={styles.basicInfo}>
        <h2>{profile.displayName}</h2>
        <p className={styles.joinDate}>
          Joined {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        <p className={styles.bio}>{profile.bio}</p>
      </div>
      <button
        className={`${styles.followBtn} ${isFollowing ? styles.unfollow : styles.follow}`}
        onClick={handleFollowToggle}
        aria-label={
          isFollowing
            ? `Unfollow ${profile.displayName}`
            : `Follow ${profile.displayName}`
        }
      >
        {isFollowing ? (
          <>
            <UserMinus size={18} />
            <span>Unfollow</span>
          </>
        ) : (
          <>
            <UserPlus size={18} />
            <span>Follow</span>
          </>
        )}
      </button>
    </article>
  );
}
