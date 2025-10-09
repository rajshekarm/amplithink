interface props{
    title:string;
    description:string;
}


export default function LoadingState({title,description}:props) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}