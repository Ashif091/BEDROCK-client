"use client"
import Header from '@/components/landing-page/header';
import React from 'react'
import NonAuth from '@/components/hoc/nonAuth';
import Footer from '@/components/landing-page/footer';
const HomePageLayout = ({ children }: { children: React.ReactNode }) => {

 return (
    <main className='light-effect  '>
      <Header />
      {children}
      <Footer/>
    </main>
  );
};

export default NonAuth(HomePageLayout)