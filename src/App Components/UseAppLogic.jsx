import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_ODIN_BOOK_API_URL;

export function useAppLogic() {
  const [auth, setAuth] = useState(false);
  const [account, setAccount] = useState(null);
  const [homePosts, setHomePosts] = useState(null);
  const [followings, setFollowings] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [trendingPosts, setTrendingPosts] = useState(null);
  const [exploreProfiles, setExploreProfiles] = useState(null);
  const [myPosts, setMyPosts] = useState(null);
  const [likedPosts, setLikedPosts] = useState(null);
  const [commentedPosts, setCommentedPosts] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
    if (authToken) {
      getAccountInfo(authToken);
      getFollowings(authToken);
      getFollowers(authToken);
      getExploreProfiles(authToken);
      getMyPosts(authToken);
      getHomePosts(authToken);
      getTrendingPosts(authToken);
      getLikedPosts(authToken);
      getCommentedPosts(authToken);
    }
  }, []);

  const tab = [
    { link: "", label: "Sign-In", logo: "/login.svg" },
    { link: "home", label: "Home", logo: "/home-circle.svg" },
    { link: "trending", label: "Trending", logo: "/trending-up.svg" },
    { link: "follow", label: "Follow", logo: "/account-plus.svg" },
    { link: "myProfile", label: "My Profile", logo: "/account.svg" },
    { link: "setting", label: "Setting", logo: "/cog.svg" },
  ];

  const getAccountInfo = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/self`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        let profilePhoto = result.profilePhoto || "/default avatar.png";
        if (
          result.profileType === "guest" &&
          result.username === "goku@gmail.com"
        ) {
          profilePhoto = "/goku.jpeg";
        } else if (
          result.profileType === "guest" &&
          result.username === "vegeta@gmail.com"
        ) {
          profilePhoto = "/vegeta.jpg";
        }

        setAccount({
          id: result.id,
          profileId: result.profileID,
          keyID: crypto.randomUUID(),
          username: result.username,
          createdAt: result.createdAt,
          displayName: result.profileDisplayName,
          bio: result.profileBio || "No Bio Available",
          profileType: result.profileType,
          photo: profilePhoto,
          followingCount: result.followingCount,
          followersCount: result.followersCount,
        });
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshAccount = () =>
    getAccountInfo(localStorage.getItem("authorization"));

  const getFollowings = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/profile/followings`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          let profilePhoto = item.profilePhoto || "/default avatar.png";
          if (item.type === "guest" && item.displayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (item.type === "guest" && item.displayName === "Vegeta") {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            userId: item.userId,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            displayName: item.displayName,
            bio: item.bio || "No Bio Available",
            photo: profilePhoto,
            type: item.type,
          };
        });
        setFollowings(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshFollowings = () =>
    getFollowings(localStorage.getItem("authorization"));

  const getFollowers = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/profile/followers`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          let profilePhoto = item.profilePhoto || "/default avatar.png";
          if (item.type === "guest" && item.displayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (item.type === "guest" && item.displayName === "Vegeta") {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            userId: item.userId,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            displayName: item.displayName,
            bio: item.bio || "No Bio Available",
            photo: profilePhoto,
            type: item.type,
          };
        });
        setFollowers(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshFollowers = () =>
    getFollowers(localStorage.getItem("authorization"));

  const getExploreProfiles = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/user/profile/explore`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const neededItems = result.map((item) => {
          let profilePhoto = item.profilePhoto || "/default avatar.png";
          if (item.type === "guest" && item.displayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (item.type === "guest" && item.displayName === "Vegeta") {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            userId: item.userId,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            displayName: item.displayName,
            bio: item.bio || "No Bio Available",
            photo: profilePhoto,
            type: item.type,
          };
        });
        setExploreProfiles(neededItems);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshExploreProfiles = () =>
    getExploreProfiles(localStorage.getItem("authorization"));

  const changeFollowingStatus = async (contactId) => {
    let authToken = localStorage.getItem("authorization");
    try {
      const response = await fetch(`${apiUrl}/user/profile/change/following`, {
        method: "PATCH",
        headers: {
          authorization: `${authToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ contactId }),
      });

      if (response.ok) {
        refreshAccount();
        refreshFollowings();
        refreshExploreProfiles();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          alert(err.error || "Upload failed");
        } else {
          alert("Upload failed: Server error");
        }
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const getHomePosts = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/post/index`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const posts = result.map((item) => {
          let profilePhoto = item.profilePhoto || "/default avatar.png";
          if (item.type === "guest" && item.profileDisplayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (
            item.type === "guest" &&
            item.profileDisplayName === "Vegeta"
          ) {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            content: item.content,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            profileId: item.profileId,
            likeCount: item.likeCount,
            commentCount: item.commentCount,
            profileDisplayName: item.profileDisplayName,
            profileType: item.profileType,
            profilePhoto: profilePhoto,
          };
        });
        setHomePosts(posts);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshHomePosts = () =>
    getHomePosts(localStorage.getItem("authorization"));

  const getTrendingPosts = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/post/trending`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const posts = result.map((item) => {
          let profilePhoto = item.profilePhoto || "/default avatar.png";
          if (item.type === "guest" && item.profileDisplayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (
            item.type === "guest" &&
            item.profileDisplayName === "Vegeta"
          ) {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            content: item.content,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            profileId: item.profileId,
            likeCount: item.likeCount,
            commentCount: item.commentCount,
            profileDisplayName: item.profileDisplayName,
            profileType: item.profileType,
            profilePhoto: profilePhoto,
          };
        });
        setTrendingPosts(posts);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshTrendingPosts = () =>
    getTrendingPosts(localStorage.getItem("authorization"));

  const getMyPosts = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/post/mine`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const posts = result.map((item) => {
          let profilePhoto = item.profilePhoto || "/default avatar.png";
          if (item.type === "guest" && item.profileDisplayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (
            item.type === "guest" &&
            item.profileDisplayName === "Vegeta"
          ) {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            content: item.content,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            profileId: item.profileId,
            likeCount: item.likeCount,
            commentCount: item.commentCount,
            profileDisplayName: item.profileDisplayName,
            profileType: item.profileType,
            profilePhoto: profilePhoto,
          };
        });
        setMyPosts(posts);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshMyPosts = () =>
    getMyPosts(localStorage.getItem("authorization"));

  const getLikedPosts = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/post/liked`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const posts = result.map((item) => {
          let profilePhoto = item.profilePhoto || "/default avatar.png";
          if (item.type === "guest" && item.profileDisplayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (
            item.type === "guest" &&
            item.profileDisplayName === "Vegeta"
          ) {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            content: item.content,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            profileId: item.profileId,
            likeCount: item.likeCount,
            commentCount: item.commentCount,
            profileDisplayName: item.profileDisplayName,
            profileType: item.profileType,
            profilePhoto: profilePhoto,
          };
        });
        setLikedPosts(posts);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshLikedPosts = () =>
    getLikedPosts(localStorage.getItem("authorization"));

  const getCommentedPosts = async (authToken) => {
    try {
      const response = await fetch(`${apiUrl}/post/commented`, {
        method: "GET",
        headers: {
          authorization: `${authToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        const posts = result.map((item) => {
          let profilePhoto = item.profilePhoto || "/default avatar.png";
          if (item.type === "guest" && item.profileDisplayName === "Goku") {
            profilePhoto = "/goku.jpeg";
          } else if (
            item.type === "guest" &&
            item.profileDisplayName === "Vegeta"
          ) {
            profilePhoto = "/vegeta.jpg";
          }
          return {
            id: item.id,
            content: item.content,
            keyID: crypto.randomUUID(),
            createdAt: item.createdAt,
            profileId: item.profileId,
            likeCount: item.likeCount,
            commentCount: item.commentCount,
            profileDisplayName: item.profileDisplayName,
            profileType: item.profileType,
            profilePhoto: profilePhoto,
          };
        });
        setCommentedPosts(posts);
        setAuth(true);
      } else if (response.status === 401) {
        setAuth(false);
        localStorage.removeItem("authorization");
        console.log(
          "Unauthorized access - possibly due to expired token. Please log in again.",
        );
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const refreshCommentedPosts = () =>
    getCommentedPosts(localStorage.getItem("authorization"));

  const createPost = async (content) => {
    let authToken = localStorage.getItem("authorization");
    try {
      const response = await fetch(`${apiUrl}/post/textOnly`, {
        method: "POST",
        headers: {
          authorization: `${authToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        refreshMyPosts();
        refreshHomePosts();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          alert(err.error || "Upload failed");
        } else {
          alert("Upload failed: Server error");
        }
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const likePost = async (e, postID) => {
    e.stopPropagation();
    let authToken = localStorage.getItem("authorization");
    try {
      const response = await fetch(`${apiUrl}/post/like`, {
        method: "PATCH",
        headers: {
          authorization: `${authToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ postID }),
      });

      if (response.ok) {
        refreshLikedPosts();
        refreshCommentedPosts();
        refreshMyPosts();
        refreshTrendingPosts();
        refreshHomePosts();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          alert(err.error || "Upload failed");
        } else {
          alert("Upload failed: Server error");
        }
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const deletePost = async (e, postID) => {
    e.stopPropagation();
    let authToken = localStorage.getItem("authorization");
    try {
      const response = await fetch(`${apiUrl}/post/${postID}`, {
        method: "DELETE",
        headers: {
          authorization: `${authToken}`,
        },
      });

      if (response.ok) {
        refreshLikedPosts();
        refreshCommentedPosts();
        refreshMyPosts();
        refreshTrendingPosts();
        refreshHomePosts();
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await response.json();
          alert(err.error || "Upload failed");
        } else {
          alert("Upload failed: Server error");
        }
      }
    } catch (err) {
      console.error("Upload Error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("authorization");
    setAuth(false);
    setAccount(null);
    setMyPosts(null);
    setHomePosts(null);
    setFollowings(null);
    setFollowers(null);
    setTrendingPosts(null);
    setExploreProfiles(null);
    setLikedPosts(null);
    navigate("/", { replace: false });
  };

  return {
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
  };
}
