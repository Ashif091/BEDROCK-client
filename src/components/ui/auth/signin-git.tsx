import React, {useEffect} from "react"
import {useAuthStore} from "@/stores/authStore"
import Image from "next/image"
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import git_icon from "../../../../public/github-icon.png"
const SignInWithGit = () => {
  const handleGitSignIn = () => {
    window.open(`${BASE_URL}/auth/github`, "_self")
  }
  return (
    <Image
      onClick={handleGitSignIn}
      width={50}
      height={50}
      className="cursor-pointer"
      alt="git"
      src={git_icon}
    />
  )
}

export default SignInWithGit
