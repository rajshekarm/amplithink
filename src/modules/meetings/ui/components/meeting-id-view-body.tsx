

const MeetingIdViewBody = ({ meetingId }: { meetingId: string }) => {
  return <div>
    
    Meeting Body Component for meeting ID: {meetingId}
    <div className="flex gap-2 my-4">
        <button className="">Start </button>
        <button>Join </button>
        <button>Share </button> 
        <button>Record </button>
        <button>End </button>
        <button>Chat </button>
        <button>Notes </button> 
    </div>
    </div>;
}
export default MeetingIdViewBody;
