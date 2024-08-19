"use client"
import Header from '@/components/landing-page/header';
import React from 'react'
import nonAuth from '@/components/hoc/nonAuth';
const HomePageLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <main className='light-effect  '>
      <Header />
      {children}
    </main>
  );
};

export default nonAuth(HomePageLayout)