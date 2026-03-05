import styles from "./postCard.module.css";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useContext } from "react";
import { ItemContext } from "../ItemContext";

export function PostCard({ post }) {
  const { likePost, deletePost, account } = useContext(ItemContext);
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
        <button onClick={(e) => likePost(e, post.id)}>
          <Heart size={25} /> {post.likeCount}
        </button>
        <button>
          <MessageCircle size={25} /> {post.commentCount}
        </button>
        {account.profileId === post.profileId && (
          <button onClick={(e) => deletePost(e, post.id)}>
            <Trash2 size={25} color="red" />
          </button>
        )}
      </div>
    </article>
  );
}
