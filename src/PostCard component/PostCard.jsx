import styles from "./postCard.module.css";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { useContext, useCallback } from "react";
import { ItemContext } from "../ItemContext";
import { useNavigate } from "react-router-dom";

export function PostCard({ post }) {
  const { likePost, deletePost, account } = useContext(ItemContext);
  const navigate = useNavigate();

  const handleNavigateToPost = useCallback(() => {
    navigate(`/post/${post.id}`, { replace: false });
  }, [navigate, post.id]);

  const handleLike = useCallback(
    (e) => {
      e.stopPropagation();
      likePost(e, post.id);
    },
    [likePost, post.id],
  );

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      deletePost(e, post.id);
    },
    [deletePost, post.id],
  );

  const formattedDate = new Date(post.createdAt).toLocaleString();
  const isOwnPost = account?.profileId === post.profileId;

  return (
    <article
      className={styles.postCard}
      onClick={handleNavigateToPost}
      role="article"
      tabIndex={0}
    >
      <div className={styles.photoSection}>
        <img
          src={post.profilePhoto}
          alt={`${post.profileDisplayName}'s avatar`}
          className={styles.profileImg}
        />
        <div className={styles.userInfo}>
          <h3>{post.profileDisplayName}</h3>
          <time dateTime={post.createdAt} className={styles.timestamp}>
            {formattedDate}
          </time>
        </div>
      </div>

      <div className={styles.contentSection}>
        <p>{post.content}</p>
      </div>

      <div className={styles.postActions}>
        <button
          className={styles.actionBtn}
          onClick={handleLike}
          aria-label={`Like post (${post.likeCount} likes)`}
        >
          <Heart size={20} />
          <span>{post.likeCount}</span>
        </button>
        <button
          className={styles.actionBtn}
          aria-label={`${post.commentCount} comments`}
        >
          <MessageCircle size={20} />
          <span>{post.commentCount}</span>
        </button>
        {isOwnPost && (
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={handleDelete}
            aria-label="Delete post"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </article>
  );
}
