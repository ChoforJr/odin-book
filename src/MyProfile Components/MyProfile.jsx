import styles from "./myProfile.module.css";
import { ItemContext } from "../ItemContext";
import { useContext, useState, useCallback } from "react";
import { ProfileCard } from "../ProfileCard component/ProfileCard";
import { PostCard } from "../PostCard component/PostCard";

export const MyProfile = () => {
  const {
    auth,
    account,
    myPosts,
    likedPosts,
    commentedPosts,
    followings,
    followers,
  } = useContext(ItemContext);

  const [activeTab, setActiveTab] = useState("Post");

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  if (!auth || !account) {
    return (
      <div className={styles.loginMsg}>
        <h1>Please Log In to view your profile</h1>
        <p>Sign in to see your posts, followers, and more.</p>
      </div>
    );
  }

  const tabs = [
    { id: "Post", label: "Posts" },
    { id: "Liked", label: "Liked Posts" },
    { id: "Commented On", label: "Commented On" },
    { id: "Followers", label: "Followers" },
    { id: "Followings", label: "Following" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Post":
        return myPosts?.map((post) => <PostCard post={post} key={post.id} />);
      case "Liked":
        return likedPosts?.map((post) => (
          <PostCard post={post} key={post.id} />
        ));
      case "Commented On":
        return commentedPosts?.map((post) => (
          <PostCard post={post} key={post.id} />
        ));
      case "Followers":
        return followers?.map((profile) => (
          <ProfileCard profile={profile} key={profile.id} />
        ));
      case "Followings":
        return followings?.map((profile) => (
          <ProfileCard profile={profile} key={profile.id} />
        ));
      default:
        return null;
    }
  };

  return (
    <section className={styles.myProfile}>
      <article className={styles.profileHeader}>
        <div className={styles.photoSection}>
          <img
            src={account.photo}
            alt={account.displayName}
            className={styles.profileImg}
          />
        </div>
        <div className={styles.basicInfo}>
          <h2>{account.displayName}</h2>
          <p className={styles.username}>@{account.username}</p>
          <p className={styles.joinDate}>
            Joined {new Date(account.createdAt).toLocaleDateString()}
          </p>
          <p className={styles.bio}>{account.bio}</p>
          <div className={styles.basicInfoFollows}>
            <div className={styles.followItem}>
              <span className={styles.followCount}>
                {account.followingCount}
              </span>
              <span className={styles.followLabel}>Following</span>
            </div>
            <div className={styles.followItem}>
              <span className={styles.followCount}>
                {account.followersCount}
              </span>
              <span className={styles.followLabel}>Followers</span>
            </div>
          </div>
        </div>
      </article>

      <nav className={styles.tabNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.contentArea}>
        <h3 className={styles.contentTitle}>{activeTab}</h3>
        <article className={styles.contentList}>{renderContent()}</article>
      </div>
    </section>
  );
};
