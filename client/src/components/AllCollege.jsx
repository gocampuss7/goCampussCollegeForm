import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AllCollege = () => {
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backendUrl}/api/college-info`
        );
        setColleges(res.data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };

    fetchColleges();
  }, []);

  const filteredColleges = colleges.filter((college) =>
    college.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (college.location && college.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-amber-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Colleges</h1>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredColleges.map((college) => (
          <div
            key={college._id}
            onClick={() => navigate(`/college/${college._id}`)}
            className="bg-white cursor-pointer rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
          >
            <img
              src={college.profilePic}
              alt={college.collegeName}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{college.collegeName}</h2>
              <p className="text-sm text-gray-600">{college.location}</p>
              <p className="text-sm text-gray-500 mt-1">
                {college.counsellingNames || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredColleges.length === 0 && (
        <p className="text-center text-gray-600 mt-10">No colleges found.</p>
      )}
    </div>
  );
};

export default AllCollege;
