import "./App.css";
import { useState, useRef, useCallback } from "react";
import { Link, Outlet } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useAppLogic } from "./UseAppLogic";
import { Plus, X } from "lucide-react";

const App = () => {
  const {
    postID,
    auth,
    tab,
    logout,
    setAuth,
    account,
    refreshAccount,
    followings,
    refreshFollowings,
    followers,
    refreshFollowers,
    exploreProfiles,
    refreshExploreProfiles,
    changeFollowingStatus,
    homePosts,
    trendingPosts,
    myPosts,
    likedPosts,
    commentedPosts,
    createPost,
    likePost,
    deletePost,
  } = useAppLogic();

  const [postContent, setPostContent] = useState("");
  const postContentRef = useRef(null);

  const handleOpenPostDialog = useCallback(() => {
    postContentRef.current?.showModal();
  }, []);

  const handleClosePostDialog = useCallback(() => {
    postContentRef.current?.close();
    setPostContent("");
  }, []);

  const handleCreatePost = useCallback(() => {
    createPost(postContent);
    handleClosePostDialog();
  }, [postContent, createPost, handleClosePostDialog]);

  const contextValue = {
    postID,
    auth,
    logout,
    setAuth,
    account,
    refreshAccount,
    followings,
    refreshFollowings,
    followers,
    refreshFollowers,
    exploreProfiles,
    refreshExploreProfiles,
    changeFollowingStatus,
    homePosts,
    trendingPosts,
    myPosts,
    likedPosts,
    commentedPosts,
    likePost,
    deletePost,
  };

  return (
    <div className="container">
      <nav className="sidebar">
        <h1 className="navBarHeader">
          <Link to="/" className="logo-link">
            <img src="/logo.svg" alt="Odin-Book logo" width={40} height={40} />
            <span>Odin-Book</span>
          </Link>
        </h1>
        <section className="nav-tabs">
          {tab.map((item) => (
            <Link to={`/${item.link}`} key={item.link} className="tab-link">
              <img src={item.logo} alt={item.label} width={24} height={24} />
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            className="tab create-post-btn"
            onClick={handleOpenPostDialog}
            aria-label="Create a new post"
          >
            <Plus size={24} />
            <span>Add Post</span>
          </button>
        </section>
      </nav>
      <main className="main-content">
        <ItemContext.Provider value={contextValue}>
          <Outlet />
        </ItemContext.Provider>
      </main>
      <footer className="app-footer">
        <p>
          Made by{" "}
          <a
            href="https://github.com/ChoforJr/odin-book"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chofor Forsakang
          </a>
        </p>
      </footer>
      <dialog ref={postContentRef} className="post-dialog">
        <div className="dialog-header">
          <h2>Create a Post</h2>
          <button
            className="close-btn"
            onClick={handleClosePostDialog}
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>
        <textarea
          className="post-textarea"
          placeholder="What's on your mind?"
          minLength={4}
          maxLength={800}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          aria-label="Post content"
        />
        <div className="dialog-actions">
          <button
            className="btn btn-primary"
            onClick={handleCreatePost}
            disabled={postContent.trim().length === 0}
          >
            Post
          </button>
          <button className="btn btn-secondary" onClick={handleClosePostDialog}>
            Cancel
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default App;
