
import TimetableForm from "@/components/TimetableForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Timetable Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your perfect schedule by telling us your preferences. Our intelligent algorithm will generate an optimized timetable just for you.
          </p>
        </div>
        <TimetableForm />
      </div>
    </div>
  );
};

export default Index;
