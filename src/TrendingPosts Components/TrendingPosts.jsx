import styles from "./trendingPosts.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
import { PostCard } from "../PostCard component/PostCard";

export const TrendingPosts = () => {
  const { trendingPosts } = useContext(ItemContext);

  if (!trendingPosts) {
    return <h1 className={styles.noPosts}>Loading...</h1>;
  }
  if (trendingPosts.length == 0) {
    return <h1 className={styles.noPosts}>No posts to show</h1>;
  }
  return (
    <section className={styles.trendingPosts}>
      {trendingPosts.map((post) => (
        <PostCard post={post} key={post.keyID} />
      ))}
    </section>
  );
};
