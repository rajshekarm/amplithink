import { AgentIdView } from "@/modules/agents/ui/views/agent-id-view";

interface Props {
  params: { agentId: string };
}

const Page = async ({ params }: Props) => {

    console.log("AgentIdView page rendering for agentId:" + params.agentId);
  const { agentId } = await params;

  
  return (
    <div>
      <AgentIdView agentId={agentId} />
    </div>
  );
};

export default Page;
