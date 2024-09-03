import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
import Image from 'next/image';
import google_icon from "../../../../public/google-icon.png"
const SignInWithGoogle = () => {
  const handleGoogleSignIn = () => {
    window.open(`${BASE_URL}/auth/google`, '_self');
  };
  return (
    <Image
      onClick={handleGoogleSignIn}
      width={50}
      height={50}
      className="cursor-pointer"
      alt="git"
      src={google_icon}
    />
  );
};

export default SignInWithGoogle;
