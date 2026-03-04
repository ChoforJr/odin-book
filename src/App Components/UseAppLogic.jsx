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
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

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
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

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
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

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
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // function addContactMessages(newMessages) {
  //   setContactMessages((prevMessages) => {
  //     return [...prevMessages, newMessages];
  //   });
  // }
  const navigate = useNavigate();
  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
    if (authToken) {
      getAccountInfo(authToken);
      getFollowings(authToken);
      getExploreProfiles(authToken);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authorization");
    setAuth(false);
    setAccount(null);
    setHomePosts(null);
    setFollowings(null);
    setFollowers(null);
    setTrendingPosts(null);
    setExploreProfiles(null);
    navigate("/", { replace: false });
  };

  return {
    auth,
    tab,
    logout,
    setAuth,
    account,
    refreshAccount: () => getAccountInfo(localStorage.getItem("authorization")),
    followings,
    refreshFollowings: () =>
      getFollowings(localStorage.getItem("authorization")),
    followers,
    refreshFollowers: () => getFollowers(localStorage.getItem("authorization")),
    exploreProfiles,
    refreshExploreProfiles: () =>
      getExploreProfiles(localStorage.getItem("authorization")),
    homePosts,
    trendingPosts,
  };
}
