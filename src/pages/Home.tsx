import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import FeaturedVideos from '../components/featured/FeaturedVideos';
import Profile from '../components/Profile';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedVideos />
      <Profile />
    </>
  );
}