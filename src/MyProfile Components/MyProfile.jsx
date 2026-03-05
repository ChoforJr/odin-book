import styles from "./myProfile.module.css";
import { ItemContext } from "../ItemContext";
import { useContext, useState } from "react";
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

  const [selectNavBar, setSelectNavBar] = useState("Post");

  if (!auth || !account)
    return (
      <div className={styles.loginMsg}>
        <h1>Please Log In to see your Profile.</h1>
      </div>
    );

  return (
    <section className={styles.myProfile}>
      <article className={styles.profileHeader}>
        <div className={styles.photoSection}>
          <img
            src={account.photo}
            alt="Profile"
            className={styles.profileImg}
          />
        </div>
        <div className={styles.basicInfo}>
          <h2>{account.displayName}</h2>
          <p>{account.username}</p>
          <p>Joined: {new Date(account.createdAt).toLocaleDateString()}</p>
          <p>Bio: {account.bio}</p>
          <div className={styles.basicInfoFollows}>
            <p>Following: {account.followingCount}</p>
            <p>Followers: {account.followersCount}</p>
          </div>
        </div>
      </article>
      <article className={styles.navBar}>
        <button onClick={() => setSelectNavBar("Post")}>Post</button>
        <button onClick={() => setSelectNavBar("Liked")}>Liked</button>
        <button onClick={() => setSelectNavBar("Commented On")}>
          Commented On
        </button>
        <button onClick={() => setSelectNavBar("Followers")}>Followers</button>
        <button onClick={() => setSelectNavBar("Followings")}>
          Followings
        </button>
      </article>
      <h1>{selectNavBar}</h1>
      <article>
        {selectNavBar === "Post" &&
          myPosts.map((post) => <PostCard post={post} key={post.keyID} />)}
        {selectNavBar === "Liked" &&
          likedPosts.map((post) => <PostCard post={post} key={post.keyID} />)}
        {selectNavBar === "Commented On" &&
          commentedPosts.map((post) => (
            <PostCard post={post} key={post.keyID} />
          ))}
        {selectNavBar === "Followers" &&
          followers.map((profile) => (
            <ProfileCard profile={profile} key={profile.keyID} />
          ))}
        {selectNavBar === "Followings" &&
          followings.map((profile) => (
            <ProfileCard profile={profile} key={profile.keyID} />
          ))}
      </article>
    </section>
  );
};
