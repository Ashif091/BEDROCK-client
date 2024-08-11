"use client"
import React, {useEffect, useState} from "react"
import Image from "next/image"
import Logo from "../../../../public/logo.png"
import grap_img from "../../../../public/gaph3d.png"
// import GithubLight from "../../../../public/other/github.png";
// import GithubDark from "../../../../public/other/githubDark.png";
// import Google from "../../../../public/other/google.png";
import axios from "axios"
import Link from "next/link"

const signupPage = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }

  return (
    <section className="sm:flex justify-center fixed h-screen   w-full light-effect-l">
      <div
        className="w-[30%]
        blur-[100px]
        rounded-full
        h-40
        absolute
        dark:bg-brand/brand-PrimaryPurple
        dark:bg-brand/brand-
        -z-10
        -bottom-10
        -left-36"
      />
      <div className="sm:w-1/2 sm:text-center gap-5 flex flex-col  sm:justify-center sm:items-center p-5 select-none">
        <Link href={"/"}>
          <div className="flex gap-0 mt-0">
            <Image
              className="mb-2 w-20  sm:w-32"
              src={Logo}
              alt="ZensyncLogo"
            />
            <h1 className="font-koulen text-5xl mt-11  scale-y-110">BEDROCK</h1>
          </div>
        </Link>
        <div className="leading-[2rem] sm:ml-12 select-none">
          <div className="text-[22px] font-light mb-3 ">
            <p>Unleash Your Creativity </p>
            <p>with Our Seamless Graph Connection</p>
          </div>
          <p>
            Already have an account? {}
            <Link href={"/login"}>
              <span className="font-bold text-blue-600">Sign In</span>{" "}
            </Link>
          </p>
        </div>
      </div>
      <div className="sm:w-1/2 text-center flex flex-col justify-center items-center select-none">
        <h2 className="md:text-4xl mb-5 text-3xl font-light">Sign Up</h2>

        <form className="space-y-1 sm:w-3/5 w-3/4 text-start">
          <div>
            <label htmlFor="email" className=" dark:text-gray-200 text-sm">
              FullName
            </label>
            <input
              id="email"
              className="border bg-transparent dark:border-gray-700 p-2 placeholder:text-base border-gray-300 rounded-lg w-full focus:outline-gray-800 "
              type="email"
              placeholder="Enter your FullName"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className=" dark:text-gray-200 text-sm">
              Email
            </label>
            <input
              id="email"
              className="border bg-transparent dark:border-gray-700 p-2 placeholder:text-base border-gray-300 rounded-lg w-full focus:outline-gray-800 "
              type="email"
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 dark:text-gray-200 text-sm"
            >
              Password
            </label>
            <input
              id="password"
              className="border bg-transparent dark:border-gray-700 p-2 mb-2 placeholder:text-base border-gray-300 rounded-lg w-full "
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 dark:text-gray-200 text-sm"
            >
              Confirm password
            </label>
            <input
              id="password"
              className="border bg-transparent dark:border-gray-700 p-2 mb-2 placeholder:text-base border-gray-300 rounded-lg w-full "
              type="password"
              placeholder="Confirm password"
              required
            />
          </div>

          <button type="submit" className="w-full rounded-lg bg-[#7457ee] h-12">
            Sign Up
          </button>
          {/* <div className="md:mt-3 ">
              <p>Or continue with</p>
              <div className="flex gap-4 mt-3 justify-center">
                <Image
                  onClick={handleGoogleSignIn}
                  src={Google}
                  alt="Google"
                  className="cursor-pointer w-9 h-9"
                />
                <Image
                  onClick={handleGithubSignIn}
                  src={Github}
                  alt="GitHUb"
                  className="cursor-pointer w-9 h-9"
                />
              </div>
            </div> */}
        </form>
      </div>
      <div className="absolute inset-0 flex items-center justify-center -z-10 ">
        <Image
          src={grap_img}
          width={400}
          alt="graph"
          className="opacity-35 object-cover mr-[5rem] mt-14"
        />
      </div>
      {/* <Image
        src={Saly}
        alt="Saly"  
        className="hidden lg:block -z-50 absolute -bottom-10 "
      /> */}
    </section>
  )
}

export default signupPage
