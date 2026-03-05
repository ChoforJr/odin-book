import styles from "./postCard.module.css";
import { Heart, MessageCircle } from "lucide-react";

export function PostCard({ post }) {
  return (
    <article className={styles.postCard} key={post.keyID}>
      <div className={styles.photoSection}>
        <img
          src={post.profilePhoto}
          alt="Profile photo"
          className={styles.profileImg}
        />
        <h2>{post.profileDisplayName}</h2>
        <p>{new Date(post.createdAt).toLocaleString()}</p>
      </div>
      <div className={styles.contentSection}>
        <p>{post.content}</p>
      </div>
      <div className={styles.postInfo}>
        <p>
          <Heart size={20} /> {post.likeCount}
        </p>
        <p>
          <MessageCircle size={20} /> {post.commentCount}
        </p>
      </div>
    </article>
  );
}
