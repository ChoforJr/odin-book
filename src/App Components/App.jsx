import "./App.css";

import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { useAppLogic } from "./UseAppLogic";

const App = () => {
  const {
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
    homePosts,
    trendingPosts,
  } = useAppLogic();

  const value = {
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
    homePosts,
    trendingPosts,
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
        </section>
      </nav>
      <main>
        <ItemContext.Provider value={value}>
          <Outlet />
        </ItemContext.Provider>
      </main>
      <footer>
        Made by{" "}
        <a href="https://github.com/ChoforJr/messaging-app" target="_blank">
          Chofor Forsakang
        </a>
      </footer>
    </div>
  );
};

export default App;
