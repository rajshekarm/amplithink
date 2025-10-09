"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export const  HomeView =() => {

  const {data: session} = authClient.useSession();
  console.log("Session:", session);
  if(!session){
    return (
      <div>
        <h1 className="text-4xl font-bold text-center mt-10">Welcome to Amplithink AI</h1>
        <h1 className="text-3xl text-center font-bold text-red-500">Please sign in to continue</h1>
      </div>  
    )
  }
  return (
    <div>
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user.name} </p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>


      <div className="flex flex-col items-center justify-center">
        <Image
          src="/amplithinkai-logo.png"
          alt="Amplithink AI Logo"
          width={300}
          height={300}
          className="mb-4"
        />
        <h1 className="text-4xl font-bold mb-2">Welcome to Amplithink AI</h1>
        <p className="text-lg text-center max-w-xl">
          Your personal AI-powered interview practice platform. Sign in to start practicing and ace your next interview with confidence!
        </p>      
          
      </div>
    </div>
   

  );
}
