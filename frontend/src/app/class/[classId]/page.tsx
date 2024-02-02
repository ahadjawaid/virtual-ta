type Params = {
    classId: string;
};

export default function Page({ params: { classId } }: { params: Params }) {
  return (
    <h1 className="text-3xl font-bold underline">
        Class: {classId}
    </h1>
  );
}