
interface Props {
  params: { agentId: string };
}
    
const Page = ({ params }: Props) => {

    const { agentId } = params;
  return <div>Meeting Page</div>;
}
export default Page;