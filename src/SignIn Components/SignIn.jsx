import styles from "./signIn.module.css";
import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ItemContext } from "../ItemContext";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
const apiUrl = import.meta.env.VITE_ODIN_BOOK_API_URL;

const SignIn = () => {
  const [login, setLogin] = useState({
    username: "",
    password: "",
  });
  const [signUp, setSignUp] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    login: false,
    signup: false,
    confirm: false,
  });

  const {
    setAuth,
    refreshAccount,
    refreshFollowings,
    refreshExploreProfiles,
    refreshFollowers,
  } = useContext(ItemContext);

  const navigate = useNavigate();

  const handleLoginChange = useCallback((e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSignUpChange = useCallback((e) => {
    const { name, value } = e.target;
    setSignUp((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLoginSubmit = useCallback(
    async (e, username = login.username, password = login.password) => {
      e?.preventDefault?.();

      if (!username || !password) {
        return alert("Please fill in all fields");
      }
      setLoading(true);

      try {
        const response = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("authorization", `Bearer ${data.token}`);
          setAuth(true);
          await Promise.all([
            refreshAccount(),
            refreshFollowings(),
            refreshExploreProfiles(),
            refreshFollowers(),
          ]);
          navigate("/setting", { replace: true });
        } else if (response.status === 400) {
          const errorMessages = data.errors.map((err) => err.msg).join("\n");
          alert(`Validation Error:\n${errorMessages}`);
        } else if (response.status === 401) {
          alert(data.error || "Invalid credentials");
        } else {
          alert("An unexpected error occurred");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Connection failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [
      login,
      setAuth,
      refreshAccount,
      refreshFollowings,
      refreshExploreProfiles,
      refreshFollowers,
      navigate,
    ],
  );

  const handleSignUpSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        !signUp.username ||
        !signUp.password ||
        !signUp.displayName ||
        !signUp.confirmPassword
      ) {
        return alert("Please fill in all fields");
      }

      if (signUp.password !== signUp.confirmPassword) {
        return alert("Passwords do not match");
      }
      setLoading(true);

      try {
        const response = await fetch(`${apiUrl}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signUp),
        });

        if (response.status === 200) {
          alert("Account created successfully! Please log in.");
          setSignUp({
            username: "",
            password: "",
            confirmPassword: "",
            displayName: "",
          });
          setIsLoginMode(true);
          return;
        }

        const data = await response.json();

        if (response.status === 400 || response.status === 422) {
          if (data.errors) {
            const errorMessages = data.errors.map((err) => err.msg).join("\n");
            alert(`Validation Error:\n${errorMessages}`);
          } else {
            alert(data.message || "Registration failed");
          }
        } else {
          alert("An unexpected error occurred");
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Connection failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [signUp],
  );

  const toggleGuestLogin = useCallback(
    (email, password) => {
      const event = { preventDefault: () => {} };
      handleLoginSubmit(event, email, password);
    },
    [handleLoginSubmit],
  );

  return (
    <div className={styles.container}>
      <div className={styles.signIn}>
        <section className={styles.formSection}>
          <div className={styles.formHeader}>
            <h1>{isLoginMode ? "Welcome Back" : "Create Account"}</h1>
            <button
              className={styles.switchBtn}
              onClick={() => setIsLoginMode(!isLoginMode)}
            >
              {isLoginMode
                ? "Need an account? Sign up"
                : "Have an account? Log in"}
            </button>
          </div>

          {isLoginMode ? (
            <form onSubmit={handleLoginSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="login-username">Email or Username</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    id="login-username"
                    type="text"
                    name="username"
                    value={login.username}
                    onChange={handleLoginChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="login-password">Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    id="login-password"
                    type={showPasswords.login ? "text" : "password"}
                    name="password"
                    value={login.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        login: !prev.login,
                      }))
                    }
                  >
                    {showPasswords.login ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="signup-email">Email</label>
                <div className={styles.inputWrapper}>
                  <Mail size={18} className={styles.inputIcon} />
                  <input
                    id="signup-email"
                    type="email"
                    name="username"
                    value={signUp.username}
                    onChange={handleSignUpChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="signup-displayName">Display Name</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    id="signup-displayName"
                    type="text"
                    name="displayName"
                    value={signUp.displayName}
                    onChange={handleSignUpChange}
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="signup-password">Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    id="signup-password"
                    type={showPasswords.signup ? "text" : "password"}
                    name="password"
                    value={signUp.password}
                    onChange={handleSignUpChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        signup: !prev.signup,
                      }))
                    }
                  >
                    {showPasswords.signup ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="signup-confirm">Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    id="signup-confirm"
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={signUp.confirmPassword}
                    onChange={handleSignUpChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() =>
                      setShowPasswords((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    {showPasswords.confirm ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          )}
        </section>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <section className={styles.guestSection}>
          <h2>Demo Accounts</h2>
          <button
            className={styles.guestBtn}
            onClick={() => toggleGuestLogin("goku@gmail.com", "1234")}
            disabled={loading}
          >
            <img src="/goku.jpeg" alt="Goku" />
            <div>
              <h3>Goku</h3>
              <p>Demo Account</p>
            </div>
          </button>
          <button
            className={styles.guestBtn}
            onClick={() => toggleGuestLogin("vegeta@gmail.com", "1234")}
            disabled={loading}
          >
            <img src="/vegeta.jpg" alt="Vegeta" />
            <div>
              <h3>Vegeta</h3>
              <p>Demo Account</p>
            </div>
          </button>
        </section>
      </div>
    </div>
  );
};

export default SignIn;
