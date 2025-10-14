 "use client"

import { columns } from "@/modules/meetings/ui/components/columns";
import { DataTable } from "@/modules/agents/ui/components/data-table";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

 
 export const MeetingsView = ()=> {
    const trpc = useTRPC();
    const router = useRouter();
    const { data, isLoading, error } = useQuery(trpc.meetings.getMany.queryOptions({}));

    if (isLoading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    if (data) {
        return <div className="flex-1 pb-4 px-4 mdLpx-8 flex flex-col gap-y-4">
            <DataTable 
            columns={columns} 
            data={data.items} 
            onRowClick={(row)=> router.push(`/meetings/${row.id}`)}
            />;
            </div>
    }     
    return <div>Meetings View</div>
    
}