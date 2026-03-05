import styles from "./homePosts.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
import { PostCard } from "../PostCard component/PostCard";

export const HomePosts = () => {
  const { homePosts } = useContext(ItemContext);

  if (!homePosts) {
    return <h1 className={styles.noPosts}>Loading...</h1>;
  }
  if (homePosts.length == 0) {
    return <h1 className={styles.noPosts}>No posts to show</h1>;
  }
  return (
    <section className={styles.homePosts}>
      {homePosts.map((post) => (
        <PostCard post={post} key={post.keyID} />
      ))}
    </section>
  );
};
