import MeetingIdView from "@/modules/meetings/ui/views/meeting-id-view";

interface Props {
  params: { meetingid: string };
}
    
const Page = async ({ params }: Props) => {

    const { meetingid } = await params;
    console.log("MeetingIdView page rendering for meetingId:" + meetingid);
  return <div><MeetingIdView meetingId={meetingid} /></div>;
}
export default Page;