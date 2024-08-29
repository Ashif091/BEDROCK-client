import React, {useEffect} from "react"
import {useAuthStore} from "@/stores/authStore"
import Image from "next/image"
import git_icon from "../../../../public/github-icon.png"
const SignInWithGit = () => {
  const handleGitSignIn = () => {
    window.open("http://localhost:3001/auth/github", "_self")
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
