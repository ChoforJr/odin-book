import "./App.css";
import { useState, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useAppLogic } from "./UseAppLogic";
import { Plus } from "lucide-react";

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
  const postContentRef = useRef("");

  const value = {
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
      <nav>
        <h1 className="navBarHeader">
          <Link to="/">
            <img src="/logo.svg" alt="logo" width={40} />
            Odin-Book
          </Link>
        </h1>
        <section>
          {tab.map((item) => (
            <div className="tab" key={item.link}>
              <img src={item.logo} alt={item.label} width={30} />
              <Link to={`/${item.link}`}>{item.label}</Link>
            </div>
          ))}
          <div
            className="tab addPost"
            onClick={() => postContentRef.current.showModal()}
          >
            <Plus size={25} /> Add Post
          </div>
        </section>
      </nav>
      <main>
        <ItemContext.Provider value={value}>
          <Outlet />
        </ItemContext.Provider>
      </main>
      <footer>
        Made by{" "}
        <a href="https://github.com/ChoforJr/odin-book" target="_blank">
          Chofor Forsakang
        </a>
      </footer>
      <dialog ref={postContentRef}>
        <h1>Create a Post</h1>
        <textarea
          name="content"
          id="content"
          placeholder="Something on my mind!!!"
          minLength={4}
          maxLength={800}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        ></textarea>
        <button
          onClick={() => (
            createPost(postContent),
            postContentRef.current.close(),
            setPostContent("")
          )}
        >
          Post
        </button>
        <button
          onClick={() => (postContentRef.current.close(), setPostContent(""))}
        >
          Cancel
        </button>
      </dialog>
    </div>
  );
};

export default App;
