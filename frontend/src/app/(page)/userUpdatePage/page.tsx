"use client"
import { useUser } from '@clerk/clerk-react';

export default function UserProfile() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (isSignedIn) {
    return (
      <div>
        <h1>Chào {user.fullName}</h1>
        <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
  {/*       <p>Phone: {user.phone}</p> */}
      </div>
    );
  }

  return <div>Người dùng chưa đăng nhập</div>;
}
