import styles from "./post.module.css";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";

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
    console.log("Rebuilding Map...");
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
    if (item.type === "guest") {
      if (item.profileDisplayName === "Goku") return "/goku.jpeg";
      if (item.profileDisplayName === "Vegeta") return "/vegeta.jpg";
    }
    return item.profilePhoto || "/default avatar.png";
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
        console.error(
          `Error ${response.status}: mapping to HTML or missing route.`,
        );
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
      console.log("Comments successfully refreshed");
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

  async function submitComment(event, addComment) {
    event.preventDefault();

    if (addComment == "") {
      return alert("You can't submit an empty field");
    }

    const authToken = localStorage.getItem("authorization");

    try {
      const response = await fetch(`${apiUrl}/comment/${postID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
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
  }

  const likeComment = async (e, commentID) => {
    e.stopPropagation();
    let authToken = localStorage.getItem("authorization");
    try {
      const response = await fetch(`${apiUrl}/comment/like`, {
        method: "PATCH",
        headers: {
          authorization: `${authToken}`,
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
          alert(err.error || "failed");
        } else {
          alert(" Server error");
        }
      }
    } catch (err) {
      console.error(" Error:", err);
    }
  };

  const deleteComment = async (e, commentID) => {
    e.stopPropagation();
    let authToken = localStorage.getItem("authorization");
    try {
      const response = await fetch(`${apiUrl}/comment/${commentID}`, {
        method: "DELETE",
        headers: {
          authorization: `${authToken}`,
        },
      });

      if (response.ok) {
        refreshPostComment();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          alert(err.error || "failed");
        } else {
          alert("Server error");
        }
      }
    } catch (err) {
      console.error(" Error:", err);
    }
  };

  if (!auth || !account) {
    return (
      <div className={styles.postFail}>
        <h1>Please Log In to see your Profile.</h1>
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
      <article className={styles.postHeader}>
        <div className={styles.photoSection}>
          <img
            src={currentPost.profilePhoto}
            alt="Profile photo"
            className={styles.profileImg}
          />
          <h2>{currentPost.profileDisplayName}</h2>
          <p>{new Date(currentPost.createdAt).toLocaleString()}</p>
        </div>
        <div className={styles.contentSection}>
          <p>{currentPost.content}</p>
        </div>
        <div className={styles.postInfo}>
          <button onClick={(e) => likePost(e, postID)}>
            <Heart size={25} /> {currentPost.likeCount}
          </button>
          {account.profileId === currentPost.profileId && (
            <button onClick={(e) => deletePost(e, postID)}>
              <Trash2 size={25} color="red" />
            </button>
          )}
        </div>
      </article>

      <hr />

      <div className={styles.addComment}>
        <input
          type="text"
          name="addComment"
          id="addComment"
          placeholder="reply..."
          value={addComment}
          onChange={(e) => setAddComment(e.target.value)}
        />
        <button onClick={(e) => submitComment(e, addComment)}>Reply</button>
      </div>

      <article className={styles.comments}>
        <p>Comments</p>
        {postComment &&
          postComment.map((comment) => (
            <article className={styles.comment} key={comment.id}>
              <div className={styles.photoSection}>
                <img
                  src={comment.profilePhoto}
                  alt="Profile photo"
                  className={styles.profileImg}
                />
                <h2>{comment.profileDisplayName}</h2>
                <p>{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
              <div className={styles.contentSection}>
                <p>{comment.content}</p>
              </div>
              <div className={styles.commentFeature}>
                <button onClick={(e) => likeComment(e, comment.id)}>
                  <Heart size={25} /> {comment.likeCount}
                </button>
                {account.profileId === comment.profileId && (
                  <button onClick={(e) => deleteComment(e, comment.id)}>
                    <Trash2 size={25} color="red" />
                  </button>
                )}
              </div>
            </article>
          ))}
      </article>
    </section>
  );
};

export default Post;
