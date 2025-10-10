import { AgentsListHeader } from "@/modules/agents/ui/components/agent-list-header"
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog"  
import AgentsViewNew from "@/modules/agents/ui/views/agent-view"

import AgentsView from "@/modules/agents/ui/views/agents-view_old"
import { getQueryClient, trpc } from "@/trpc/server"
import { get } from "http"

const Page = async ()=> {

const queryClient = getQueryClient();
void  queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return <>
  <AgentsListHeader/>
  <AgentsView/>
  <AgentsViewNew/>
  </>
}

export default Page