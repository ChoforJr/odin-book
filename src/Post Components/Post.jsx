import styles from "./post.module.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
import { Heart, Trash2, Send } from "lucide-react";

const apiUrl = import.meta.env.VITE_ODIN_BOOK_API_URL;

const Post = () => {
  const [addComment, setAddComment] = useState("");
  const [postComment, setPostComment] = useState(null);
  const {
    auth,
    postID,
    account,
    homePosts,
    trendingPosts,
    myPosts,
    likedPosts,
    commentedPosts,
    likePost,
    deletePost,
  } = useContext(ItemContext);

  const registry = useMemo(() => {
    return new Map(
      [
        ...(homePosts ?? []),
        ...(trendingPosts ?? []),
        ...(myPosts ?? []),
        ...(likedPosts ?? []),
        ...(commentedPosts ?? []),
      ].map((item) => [item.id, item]),
    );
  }, [homePosts, trendingPosts, myPosts, likedPosts, commentedPosts]);

  const currentPost = registry.get(Number(postID));

  const getProfilePhoto = (item) => {
    const type = item.type || item.profileType;
    const displayName = item.displayName || item.profileDisplayName;
    const photo = item.photo || item.profilePhoto;

    if (type === "guest") {
      if (displayName === "Goku") return "/goku.jpeg";
      if (displayName === "Vegeta") return "/vegeta.jpg";
    }
    return photo || "/default avatar.png";
  };

  const getPostComment = useCallback(async () => {
    const authToken = localStorage.getItem("authorization");
    if (!postID) return;
    try {
      const response = await fetch(`${apiUrl}/comment/${postID}`, {
        method: "GET",
        headers: { authorization: authToken },
      });

      if (!response.ok) {
        console.error(`Error ${response.status}: Failed to fetch comments`);
        return;
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(
          "Expected JSON but received HTML/Text:",
          text.slice(0, 100),
        );
        return;
      }

      const result = await response.json();
      const comments = result.map((item) => ({
        ...item,
        profilePhoto: getProfilePhoto(item),
      }));

      setPostComment(comments);
    } catch (error) {
      console.error("Network error:", error);
    }
  }, [postID]);

  const refreshPostComment = useCallback(
    () => getPostComment(),
    [getPostComment],
  );

  useEffect(() => {
    refreshPostComment();
  }, [postID, refreshPostComment]);

  const submitComment = useCallback(
    async (event) => {
      event.preventDefault();

      if (addComment.trim() === "") {
        return alert("Comment cannot be empty");
      }

      const authToken = localStorage.getItem("authorization");

      try {
        const response = await fetch(`${apiUrl}/comment/${postID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: authToken,
          },
          body: JSON.stringify({
            content: addComment,
          }),
        });

        if (response.ok) {
          setAddComment("");
          refreshPostComment();
        } else {
          const result = await response.json();
          console.error(result);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    },
    [addComment, postID, refreshPostComment],
  );

  const likeComment = useCallback(
    async (e, commentID) => {
      e.stopPropagation();
      const authToken = localStorage.getItem("authorization");
      try {
        const response = await fetch(`${apiUrl}/comment/like`, {
          method: "PATCH",
          headers: {
            authorization: authToken,
            "content-type": "application/json",
          },
          body: JSON.stringify({ commentID }),
        });

        if (response.ok) {
          refreshPostComment();
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const err = await response.json();
            alert(err.error || "Failed to like comment");
          }
        }
      } catch (err) {
        console.error("Error:", err);
      }
    },
    [refreshPostComment],
  );

  const deleteComment = useCallback(
    async (e, commentID) => {
      e.stopPropagation();
      const authToken = localStorage.getItem("authorization");
      try {
        const response = await fetch(`${apiUrl}/comment/${commentID}`, {
          method: "DELETE",
          headers: {
            authorization: authToken,
          },
        });

        if (response.ok) {
          refreshPostComment();
        } else {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const err = await response.json();
            alert(err.error || "Failed to delete comment");
          }
        }
      } catch (err) {
        console.error("Error:", err);
      }
    },
    [refreshPostComment],
  );

  if (!auth || !account) {
    return (
      <div className={styles.postFail}>
        <h1>Please Log In to view posts</h1>
        <p>Sign in to see detailed post and comments.</p>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <section className={styles.post}>
        <h1>Loading post...</h1>
        <p>If this takes too long, the post may not exist.</p>
      </section>
    );
  }

  return (
    <section className={styles.post}>
      <article className={styles.postArticle}>
        <div className={styles.postHeader}>
          <div className={styles.photoSection}>
            <img
              src={currentPost.profilePhoto}
              alt={currentPost.profileDisplayName}
              className={styles.profileImg}
            />
            <div>
              <h2>{currentPost.profileDisplayName}</h2>
              <p>{new Date(currentPost.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div className={styles.contentSection}>
            <p>{currentPost.content}</p>
          </div>
          <div className={styles.postInfo}>
            <button
              onClick={(e) => likePost(e, postID)}
              aria-label={`Like post (${currentPost.likeCount} likes)`}
            >
              <Heart size={20} />
              <span>{currentPost.likeCount}</span>
            </button>
            {account.profileId === currentPost.profileId && (
              <button
                onClick={(e) => deletePost(e, postID)}
                aria-label="Delete post"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
      </article>

      <hr />

      <div className={styles.addComment}>
        <input
          type="text"
          name="addComment"
          id="addComment"
          placeholder="Write a reply..."
          value={addComment}
          onChange={(e) => setAddComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && addComment.trim()) {
              submitComment(e);
            }
          }}
        />
        <button
          onClick={submitComment}
          disabled={addComment.trim().length === 0}
          aria-label="Send comment"
        >
          <Send size={18} />
        </button>
      </div>

      {postComment && postComment.length > 0 && (
        <article className={styles.comments}>
          <p>
            {postComment.length} Comment{postComment.length !== 1 ? "s" : ""}
          </p>
          {postComment.map((comment) => (
            <article className={styles.comment} key={comment.id}>
              <div className={styles.photoSection}>
                <img
                  src={comment.profilePhoto}
                  alt={comment.profileDisplayName}
                  className={styles.profileImg}
                />
                <div>
                  <h2>{comment.profileDisplayName}</h2>
                  <p>{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className={styles.contentSection}>
                <p>{comment.content}</p>
              </div>
              <div className={styles.commentFeature}>
                <button onClick={(e) => likeComment(e, comment.id)}>
                  <Heart size={18} />
                  <span>{comment.likeCount}</span>
                </button>
                {account.profileId === comment.profileId && (
                  <button onClick={(e) => deleteComment(e, comment.id)}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </article>
          ))}
        </article>
      )}
    </section>
  );
};

export default Post;
