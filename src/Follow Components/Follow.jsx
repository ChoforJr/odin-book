import styles from "./follow.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
import { ProfileCard } from "../profile component/ProfileCard";

export const Follow = () => {
  const { exploreProfiles } = useContext(ItemContext);

  if (!exploreProfiles) {
    return <h1 className={styles.noPosts}>Loading...</h1>;
  }
  if (exploreProfiles.length == 0) {
    return <h1 className={styles.noPosts}>No profiles to show</h1>;
  }
  return (
    <section className={styles.follow}>
      {exploreProfiles.map((profile) => (
        <ProfileCard profile={profile} key={profile.keyID} />
      ))}
    </section>
  );
};
