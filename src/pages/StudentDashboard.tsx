
import TimetableForm from "@/components/TimetableForm";

const StudentDashboard = () => {
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Generate Your Timetable
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create your perfect schedule by telling us your preferences. Our intelligent algorithm will generate an optimized timetable just for you.
        </p>
      </div>
      <TimetableForm />
    </div>
  );
};

export default StudentDashboard;
