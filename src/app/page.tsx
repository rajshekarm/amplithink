import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">Welcome to Amplithink AI</h1>
      <h1 className="text-3xl font-bold text-red-500">Welcome back</h1>

      <Button>
        Sign In
      </Button>
    </div>
   

  );
}
