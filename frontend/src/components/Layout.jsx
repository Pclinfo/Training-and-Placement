"use client";

import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './scrolltotop';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>
      {/* <ScrollToTop duration={1000} /> */}
        
        {children}</main>
      <Footer />
    </>
  );
}
