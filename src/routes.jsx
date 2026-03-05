import App from "./App Components/App";
import SignIn from "./SignIn Components/SignIn";
import { HomePosts } from "./HomePosts Components/HomePosts";
import Account from "./Account Components/Account";
import { MyProfile } from "./MyProfile Components/MyProfile";
import { TrendingPosts } from "./TrendingPosts Components/TrendingPosts";
import { Follow } from "./Follow Components/Follow";
import ErrorPage from "./ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    // This is a catch-all for errors that occur within the <App /> component or its children.
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      { path: "home", element: <HomePosts /> },
      { path: "trending", element: <TrendingPosts /> },
      { path: "follow", element: <Follow /> },
      { path: "myProfile", element: <MyProfile /> },
      { path: "setting", element: <Account /> },
    ],
  },
];

export default routes;
