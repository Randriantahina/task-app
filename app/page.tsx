import React from 'react';

import type { Metadata } from 'next';
import SignIn from './(auth)/sign-in/page';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login Page',
};

export default function LandingPage() {
  return (
    <div className="">
      <SignIn />
    </div>
  );
}
