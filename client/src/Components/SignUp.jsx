import React from 'react'
import axios from 'axios'
import { useForm } from "react-hook-form"
import SignUpPic from '../Assets/SignUpPic.jpg'


function SignUp() {

  const { register, formState: { errors, isDirty, isValid }, handleSubmit } = useForm({
    mode: "onChange",
  });
  
  const inputStyle = 'w-full border-b-2 border-[#555555] mb-4 mt-4 p-4 border-l-2 rounded-lg bg-[#F9F7CF] text-xl font-bolder text-[#AAAAAA]'

  const onSubmit = (data) => {
    const user = {
      username: data.username,
      email: data.email,
      password: data.password
    }
    axios
      .post('http://localhost:4000/sign-up', user)
      .then(res => {
        console.log("User Successfully Registered!!!", res)
      })
      .catch(err => {
        console.log("Error Registering User", err)
      })
  }
  return (
    <div className='flex'>
      <div className='leftDiv h-screen w-[40%]'>
        <img alt='chat-pic' src={SignUpPic}
          className='h-full w-full'
        ></img>
      </div>

      <div className='rightDiv bg-[#BBBBBB] h-screen w-[60%] flex items-center'>
        <form className='w-[90%] m-auto h-fit bg-[#AAAAAA] shadow-lg shadow-[#968C83] 
        rounded-lg p-10 flex-col justify-between'
          onSubmit={handleSubmit(onSubmit)}>

          <input
            {...register("username", {
              required: true, validate: {
                matchPattern: (v) => /^[a-zA-Z0-9_]+$/.test(v),
              }
            })}
            className={inputStyle}
            placeholder='Username'
          />
          {errors.username?.type === 'required' && <span className='text-red-900'>Username is required</span>}
          {errors.username?.type === 'matchPattern' && <span className='text-red-900'>
            Username must contain only letters, numbers and _
          </span>}

          <input
            {...register("email", {
              required: true, validate: {
                matchPattern: (v) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
              },
            })}
            className={inputStyle}
            placeholder='Email'
          />
          {errors.email?.type === 'required' && <span className='text-red-900'>Email is required</span>}
          {errors.email?.type === 'matchPattern' && <span className='text-red-900'>Email address must be a valid address</span>}

          <input
            {...register("password", {
              required: true, validate: {
                minLength: (v) => v.length >= 6
              },
            })}
            type='password'
            className={inputStyle}
            placeholder='Password'
          />
          {errors.password?.type === 'required' && <span className='text-red-900'>Password is required</span>}
          {errors.password?.type === 'minLength' && <span className='text-red-900'>Password must be longer than 6 characters</span>}

          <div className='mt-4 flex items-center gap-4'>
            <button type='submit' disabled={!isDirty || !isValid}
              className='rounded-lg bg-[#F2DCBB] w-1/2 h-12 text-center text-sm font-bold
               text-[#555555] sm:text-xl hover:border-b-2 hover:duration-700'>
              Sign-Up
            </button>
            <p className='text-xl font-bolder text-[#555555]'>
              OR
            </p>
            <button className='rounded-lg bg-[#F2DCBB] w-1/2 h-12 text-center text-sm font-bold
             text-[#555555] sm:text-xl hover:border-b-2 hover:duration-700'>
              Log-In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp