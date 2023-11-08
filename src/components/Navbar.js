import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BPUADOPT_LOGO from "../images/BPUADOPT_LOGO.png";
import { useAuth } from "../utils/AuthProvider";
import "./Navbar.css";
import { supabase } from "./client";

const Navbar = ({}) => {
  const { user, session, email } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async (userEmail) => {
      try {
        console.log(userEmail);
        const { data, error } = await supabase
          .from("Users")
          .select("role")
          .eq("email", userEmail)
          .single();

        if (error) {
          console.error("Error fetching user role:", error.message);
        } else {
          setRole(data.role);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    fetchUserRole(email);
  }, []);

  function handleLogout() {
    supabase.auth
      .signOut()
      .then(() => {
        Cookies.remove("userSession");
        localStorage.clear();
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top topbar">
        <div className="container">
          <div className="navbar-brand">
            <Link className="navy-link" to="/">
              <img
                src={BPUADOPT_LOGO}
                width="50"
                height="50"
                alt="BPUAdopt Logo"
                className="icon-padding me-4"
              />
              <span className="nav-item">Home</span>
            </Link>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="nav-item">
              <Link className="nav-link mx-3" to="/Pets">
                Adopt A Pet
              </Link>
            </div>
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  {role === "ADMIN" ? (
                    <li className="nav-item dropdown">
                      <li
                        className="nav-link dropdown-toggle mx-3"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {user.user_metadata.firstName}
                      </li>
                      <ul className="dropdown-menu">
                        <li className="dropdown-item">
                          <Link style={{ textDecoration: "none" }} to="/Admin">
                            Admin Dashboard
                          </Link>
                        </li>
                        <li className="dropdown-divider">
                          <hr className="dropdown-divider" />
                        </li>
                        <li className="dropdown-item">
                          <a
                            href=""
                            className="text-decoration-none"
                            onClick={handleLogout}
                          >
                            Logout
                          </a>
                        </li>
                      </ul>
                    </li>
                  ) : (
                    <li className="nav-item dropdown">
                      <li
                        className="nav-link dropdown-toggle mx-3"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {user.user_metadata.firstName}
                      </li>
                      <ul className="dropdown-menu">
                        <li className="dropdown-item">
                          <Link
                            style={{ textDecoration: "none" }}
                            to="/accountInformation"
                          >
                            Account Details
                          </Link>
                        </li>
                        <li className="dropdown-divider">
                          <hr className="dropdown-divider" />
                        </li>
                        <li className="dropdown-item">
                          <a
                            href=""
                            className="text-decoration-none"
                            onClick={handleLogout}
                          >
                            Logout
                          </a>
                        </li>
                      </ul>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link mx-3" to="/Login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link mx-3" to="/Register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
