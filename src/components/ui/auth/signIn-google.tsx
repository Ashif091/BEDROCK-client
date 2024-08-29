import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const SignInWithGoogle = () => {
  const handleGoogleSignIn = () => {
    window.open('http://localhost:3001/auth/google', '_self');
  };
  return (
    <button onClick={handleGoogleSignIn}>
      Sign In with Google
    </button>
  );
};

export default SignInWithGoogle;
