import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view"
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const Page = async() => {
  const session = await auth.api.getSession({
    headers: await headers(),
  }); // Implement your session retrieval logic here
    
  
  //if(!session)  redirect("/sign-in");
  
  return <HomeView />
}

export default Page