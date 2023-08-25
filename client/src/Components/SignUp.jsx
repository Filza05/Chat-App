import React, { useState } from "react";
import axios from "../Utils/Axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import SignUpPic from "../Assets/SignUpPic.jpg";
import VerifyModal from "./VerifyModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleVerificationModalSubmit = async (verificationCode) => {
    setShowVerifyModal(false);
    axios
      .post(`/verify-sign-up/${verificationCode}`, formData)
      .then((response) => {
        if (response.status === 201) {
          return navigate("/Login");
        }
      })
      .catch(({ response }) => {
        console.log(response);
        toast.error(response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        });
      });
  };

  const {
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });

  const inputStyle =
    "w-full border-b-4 border-[#393E46] bg-[#F7F7F7] mb-6 mt-6 p-4 border-l-2 rounded-sm text-xl font-bolder text-[#404258]";

  const onSubmit = (data) => {
    const user = data;
    axios
      .post("/request-sign-up", user)
      .then((res) => {
        if (res.status === 201) {
          setShowVerifyModal(true);
          setFormData(data);
        }
      })
      .catch(({ response }) => {
        console.log(response.data.error);
        toast.error(response.data.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        });
      });
  };
  return (
    <div className="flex bg-[#404258]">
      <div className="leftDiv h-screen w-[40%] hidden md:block">
        <img
          alt="chat-pic"
          src={SignUpPic}
          className="h-full w-full"
        ></img>
      </div>

      <div className="rightDiv bg-[#404258] h-screen md:w-[60%] w-[90%] flex items-center m-auto">
        <form
          className="w-[90%] lg:w-[65%] m-auto max-h-[fit-content] bg-[#6B728E] shadow-lg shadow-[#50577A] 
        rounded-sm p-10 flex-col justify-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("username", {
              required: true,
              validate: {
                matchPattern: (v) => /^[a-zA-Z0-9_]+$/.test(v),
              },
            })}
            className={inputStyle}
            placeholder="Username"
          />
          {errors.username?.type === "required" && (
            <span className="text-red-900">Username is required</span>
          )}
          {errors.username?.type === "matchPattern" && (
            <span className="text-red-900">
              Username must contain only letters, numbers and _
            </span>
          )}

          <input
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
              },
            })}
            className={inputStyle}
            placeholder="Email"
          />
          {errors.email?.type === "required" && (
            <span className="text-red-900">Email is required</span>
          )}
          {errors.email?.type === "matchPattern" && (
            <span className="text-red-900">
              Email address must be a valid address
            </span>
          )}

          <input
            {...register("password", {
              required: true,
              validate: {
                minLength: (v) => v.length >= 6,
              },
            })}
            type="password"
            className={inputStyle}
            placeholder="Password"
          />
          {errors.password?.type === "required" && (
            <span className="text-red-900">Password is required</span>
          )}
          {errors.password?.type === "minLength" && (
            <span className="text-red-900">
              Password must be longer than 6 characters
            </span>
          )}

          <div className="mt-12 flex items-center gap-4">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className="rounded-sm bg-[#404258] w-1/2 h-12 text-center text-sm font-bold
              text-white border-b-2 border-[#FFDDD2] sm:text-xl hover:-translate-y-2 duration-300"
            >
              Sign-Up
            </button>
            <p className="text-xl font-bolder text-white">OR</p>
            <button
              className="rounded-sm bg-[#404258] w-1/2 h-12 text-center text-sm font-bold
             text-[#FFDDD2] border-b-2 border-[#FFDDD2] sm:text-xl hover:-translate-y-2 duration-300"
            >
              <Link to="/Login">Log-In</Link>
            </button>
          </div>
        </form>
      </div>
      <VerifyModal
        showModal={showVerifyModal}
        setShowModal={setShowVerifyModal}
        handleSubmit={handleVerificationModalSubmit}
      />
    </div>
  );
}

export default SignUp;
