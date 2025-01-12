import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import "./Login.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";
import{ UserContext} from "../../../UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {
            if (userCredentials.user.emailVerified && userCredentials.user.email === email) {
                setUser(auth.currentUser);
                navigate("/", { replace: true });
            } else {
              alert("Invalid credentials");
            }
          })
          .catch((err) => {
            if (err.code === "auth/invalid-credential") {
              alert("Invalid credentials");
            }
          });
      });
  };

  useEffect(() => {
    if (user && user.emailVerified) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <>
      <div className="login-form">
        <form className="form" onSubmit={onSubmitLogin}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            value={email}
            onChange={handleEmail}
            id="email"
          ></input>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePassword}
            id="password"
            autoComplete="off"
          ></input>
          <button type="submit">Login</button>
          <p className="no-account">
            <span>If you don't have an account click </span>
            <Link className="no-account-link" to={"/register"}>
              <span>here</span>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
