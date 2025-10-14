import { auth } from "@/lib/auth";
import CallUI from "@/modules/call/ui/components/call-ui";
import { CallView } from "@/modules/call/ui/views/call-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Props {
  params: { meetingId: string };
}   

 const Page = async ({ params }: Props) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { meetingId } = await params;

//   const queryClient = getQueryClient();
//   void queryClient.prefetchQuery(
//     trpc.meetings.getOne.queryOptions({ id: meetingId }),
//   );

  return (
   
      <CallView meetingId={meetingId} /> // ❌ </HydrationBoundary>
  );
};

export default Page;