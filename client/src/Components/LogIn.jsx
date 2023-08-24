import React from "react";
import { useForm } from "react-hook-form";
import SignUpPic from "../Assets/SignUpPic.jpg";
import axiosOBJ from "../Utils/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LogIn() {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
  });

  const inputStyle =
    "w-full border-b-2 border-[#555555] mb-4 mt-4 p-4 border-l-2 rounded-lg bg-[#F9F7CF] text-xl font-bolder text-[#AAAAAA]";

  const onSubmit = (data) => {
    axiosOBJ
      .post("/request-sign-in", data)
      .then((response) => {
        if (response) {
          navigate("/");
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

  return (
    <div className="flex bg-[#BBBBBB]">
      <div className="leftDiv h-screen w-[40%] hidden sm:block">
        <img
          alt="chat-pic"
          src={SignUpPic}
          className="h-full w-full"
        ></img>
      </div>

      <div className="rightDiv bg-[#BBBBBB] h-screen sm:w-[60%] w-[90%] flex items-center m-auto">
        <form
          className="w-[90%] m-auto h-fit bg-[#AAAAAA] shadow-lg shadow-[#968C83] 
          rounded-lg p-10 flex-col justify-between"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className={`rounded-lg bg-[#F2DCBB] w-1/2 h-12 text-center font-bold
              text-[#555555] text-xl hover:border-b-2 border-[#555555] cursor-${
                !isDirty || !isValid ? "not-allowed" : "pointer"
              }`}
            >
              Log-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
