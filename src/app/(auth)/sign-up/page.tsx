
import SignUpView from "@/modules/auth/ui/views/sin-up-view";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";


const Page = async() => {
  const session = await auth.api.getSession({
    headers: await headers(),
  }); // Implement your session retrieval logic here
    
  if(!!session){
    redirect("/");
  
}
    return <SignUpView/>
}

export default Page;
