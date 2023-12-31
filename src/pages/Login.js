import Cookies from "js-cookie";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../components/client";
import loginPicture from "../images/loginPicture.png";
import { useAuth } from "../utils/AuthProvider";
import "./Login.css";
import { BeatLoader } from "react-spinners";
import BPUADOPT_LOGO from "../images/BPUAdopt_smaller.png"
import ForgotPasswordModal from "../components/ForgotPasswordModal/ForgotPasswordModal";

const Login = ({}) => {
  let navigate = useNavigate();
  const { setUser, setSession } = useAuth(); 
  const [loading, setLoading] = useState(false);



  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const [alertMessage, setAlertMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setAlertMessage("Invalid Login Credentials.")
        throw error;
      }

      Cookies.set("userSession", JSON.stringify({ data }), { expires: 1 });
      setUser(data.user);
      setSession(data.session);


      console.log("Logged In!");
      navigate("/");
    } catch (error) {
        console.log(error)
    } finally {
      setLoading(false);
    }
  }


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
      <BeatLoader type="ThreeDots" color="#fee481" height={200} width={200} className="spinner" />
    </div>
    );
  }

   return(
      <div className="container-fluid">
      <div className="row">
        <div className="left-panel col-xl-4 col-lg-4 col-md-12 d-flex flex-column">
          <h1 className="text-center mt-5">Adopt a pet today!</h1>
          <img src={loginPicture} className="img-fluid align-self-center" />
        </div>
        <div className="col-xl-8 col-lg-8 col-md-12 px-5 pt-5">
          <h1 className="formHeader">Login</h1>
          <hr className="w-100 mb-3" />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <button type="submit" className="login-btn btn rounded-pill mb-2">
                Login
              </button>
            </div>
          </form>

          {alertMessage && (
              <div className="alert alert-danger" role="alert">
                {alertMessage}
              </div>
            )}


          <div className="">
            <ForgotPasswordModal/>
          </div>
          <div>
            <Link
              to="/Register"
              style={{ textDecoration: "none" }}
            >
              <span className="text-primary "> New to BPUAdopt?</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
