"use client"
import React, {useEffect, useState} from "react"
import Image from "next/image"
import Logo from "../../../../public/logo-dark.png"
import grap_img from "../../../../public/gaph3d.png"
import NonAuth from "../../../components/hoc/nonAuth"
import {useRouter} from "next/navigation"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import { Toaster, toast } from 'sonner';
import axios from "axios"
import Link from "next/link"
import {signUpSchema} from "@/Types/Schema"
import SignInWithGoogle from "@/components/ui/auth/signIn-google"
import SignInWithGit from "@/components/ui/auth/signin-git"
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL
const SignupPage : React.FC= () => {
  const [mounted, setMounted] = useState(false)
  
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, values)
      if (response) {
        toast.success("Verificaiton Mail Send", {
          position: "top-center",
        })
        router.replace("/verify-email")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {

        toast.error(error.response.data.error, {
          position: "top-left",
        })
        console.log("error in post ", error.response.data.error)
      } else {
        console.log("An unexpected error occurred:", error)
      }
    } finally {
      reset()
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        if (error && error.message) {
          toast.error(error.message, {position: "top-left"})
        }
      })
    }
  }, [errors])
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
        <Toaster/>
        <h2 className="md:text-4xl mb-5 text-3xl font-light">Sign Up</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-1 sm:w-3/5 w-3/4 text-start"
        >
          <div>
            <label htmlFor="fullname" className=" dark:text-gray-200 text-sm">
              FullName
            </label>
            <input
              {...register("fullname")}
              id="fullname"
              className="border bg-transparent dark:border-gray-700 p-2 placeholder:text-base border-gray-300 rounded-lg w-full  focus:border-[#7457ec] focus:outline-none focus:ring-1 focus:ring-[#7457ec] "
              type="text"
              placeholder="Enter your FullName"
            />
          </div>
          <div>
            <label htmlFor="email" className=" dark:text-gray-200 text-sm">
              Email
            </label>
            <input
              {...register("email")}
              id="email"
              className="border bg-transparent dark:border-gray-700 p-2 placeholder:text-base border-gray-300 rounded-lg w-full focus:border-[#7457ec] focus:outline-none focus:ring-1 focus:ring-[#7457ec] "
              type="email"
              placeholder="Email"
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
              {...register("password")}
              id="password"
              className="border bg-transparent dark:border-gray-700 p-2 mb-2 placeholder:text-base border-gray-300 rounded-lg w-full focus:border-[#7457ec] focus:outline-none focus:ring-1 focus:ring-[#7457ec]  "
              type="password"
              placeholder="Password"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 dark:text-gray-200 text-sm"
            >
              Confirm password
            </label>
            <input
              {...register("confirmPassword")}
              id="confirmPassword"
              className="border bg-transparent dark:border-gray-700 p-2 mb-2 placeholder:text-base border-gray-300 rounded-lg w-full focus:border-[#7457ec] focus:outline-none focus:ring-1 focus:ring-[#7457ec] "
              type="password"
              placeholder="Confirm password"
            />
          </div>

          <button type="submit" className="w-full rounded-lg bg-[#7457ee] h-12">
            Sign Up
          </button>
        </form>
        <span className="mt-4">Or continue with</span>
        <div className="flex gap-3 ">
        <SignInWithGoogle/>
        <SignInWithGit/>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center -z-10 ">
        <Image
          src={grap_img}
          width={400}
          alt="graph"
          className="opacity-35 object-cover mr-[5rem] mt-14"
        />
      </div>
    </section>
  )
}

export default NonAuth(SignupPage)
