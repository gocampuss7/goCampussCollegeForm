import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const CollegeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_backendUrl}/api/college-info/${id}`
        );
        setCollege(res.data);
      } catch (error) {
        console.error("Error fetching college details:", error);
      }
    };

    fetchCollege();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this college?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_backendUrl}/api/college-info/${id}`
      );
      navigate("/all-colleges");
    } catch (error) {
      console.error("Error deleting college:", error);
      alert("Failed to delete college.");
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  if (!college) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-amber-100 shadow-lg rounded-xl mb-10">
      <div className="absolute top-4 right-10 flex gap-2">
        <button onClick={handleEdit} title="Edit College">
          <FiEdit className="text-blue-600 hover:text-blue-800 text-2xl" />
        </button>
        <button onClick={handleDelete} title="Delete College">
          <FiTrash2 className="text-red-600 hover:text-red-800 text-2xl" />
        </button>
      </div>

      {/* College Name & Profile Picture */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          {college.collegeName}
        </h1>
        {college.profilePic && (
          <img
            src={college.profilePic}
            alt="College Profile"
            className="rounded-xl mt-4 w-full max-h-96 object-cover shadow-lg"
          />
        )}
      </div>

      {/* College Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4 text-gray-600">
          <p>
            <strong className="font-medium text-gray-800">Established:</strong>{" "}
            {college.established || "N/A"}
          </p>
          <p>
            <strong className="font-medium text-gray-800">Location:</strong>{" "}
            {college.location || "N/A"}
          </p>
          <p>
            <strong className="font-medium text-gray-800">Campus:</strong>{" "}
            {college.campus || "N/A"}
          </p>
          <p>
            <strong className="font-medium text-gray-800">NIRF Ranking:</strong>{" "}
            {college.nirfRanking || "N/A"}
          </p>
          <p>
            <strong className="font-medium text-gray-800">
              Counselling Names:
            </strong>{" "}
            {college.counsellingNames || "N/A"}
          </p>
          <p>
            <strong className="font-medium text-gray-800">NBA Branches:</strong>{" "}
            {college.nbaBranches || "N/A"}
          </p>
        </div>

        {/* Seat Matrix */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Seat Matrix
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            {college.seatMatrix.map((branch, idx) => (
              <li key={idx}>
                {branch.branch}:{" "}
                <span className="font-semibold">{branch.seats}</span> seats
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Placement Stats */}
      <div className="mb-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Placement Stats</h2>
        <div className="space-y-2">
          <p>
            <strong className="font-medium text-gray-800">
              Total Students:
            </strong>{" "}
            {college.placements?.totalStudents}
          </p>
          <p>
            <strong className="font-medium text-gray-800">
              Total Companies:
            </strong>{" "}
            {college.placements?.totalCompanies}
          </p>
          <p>
            <strong className="font-medium text-gray-800">Total Offers:</strong>{" "}
            {college.placements?.totalOffers}
          </p>
          <p>
            <strong className="font-medium text-gray-800">
              Highest Package:
            </strong>{" "}
            {college.placements?.highestPackage}
          </p>
          <p>
            <strong className="font-medium text-gray-800">Avg Package:</strong>{" "}
            {college.placements?.avgPackage}
          </p>
          <p>
            <strong className="font-medium text-gray-800">
              CS Avg Package:
            </strong>{" "}
            {college.placements?.csAvgPackage}
          </p>
        </div>

        {/* Companies */}
        <div>
          <h3 className="text-lg font-medium text-gray-800">Companies</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            {college.placements?.companyData?.map((company, idx) => (
              <li key={idx}>
                {company.name} - {company.offers} offers - {company.ctc} CTC
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hostel & Fee Info */}
      <div className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Hostel & Fee Info
        </h2>
        <p>
          <strong className="font-medium text-gray-800">
            Boys Hostel Fees:
          </strong>{" "}
          {college.hostelFees?.boys || "N/A"}
        </p>
        <p>
          <strong className="font-medium text-gray-800">
            Girls Hostel Fees:
          </strong>{" "}
          {college.hostelFees?.girls || "N/A"}
        </p>

        {/* Hostel Images */}
        {college.hostelImages?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Hostel Images
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {college.hostelImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Hostel Image ${idx + 1}`}
                  className="rounded-lg w-full max-h-72 object-cover shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Academic Fees */}
        <div>
          <strong className="font-medium text-gray-800">Academic Fees:</strong>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Year 1: {college.academicFees?.year1 || "N/A"}</li>
            <li>Year 2: {college.academicFees?.year2 || "N/A"}</li>
            <li>Year 3: {college.academicFees?.year3 || "N/A"}</li>
            <li>Year 4: {college.academicFees?.year4 || "N/A"}</li>
            <li>
              <strong className="font-medium text-gray-800">Total:</strong>{" "}
              {college.academicFees?.total || "N/A"}
            </li>
          </ul>
        </div>

        <p className="mt-2">
          <strong className="font-medium text-gray-800">Total Fees:</strong>{" "}
          {college.totalFees || "N/A"}
        </p>
      </div>

      {/* Categorized Images */}
      <div className="space-y-10 mb-10">
        {/* College Tour Images */}
        {college.collegeTourImages?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              College Tour Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {college.collegeTourImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`College Tour Image ${idx + 1}`}
                  className="rounded-xl w-full max-h-96 object-cover shadow-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Boys Hostel Images */}
        {college.boysHostelImages?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Boys Hostel Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {college.boysHostelImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Boys Hostel Image ${idx + 1}`}
                  className="rounded-xl w-full max-h-96 object-cover shadow-lg"
                />
              ))}
            </div>
          </div>
        )}

        {/* Girls Hostel Images */}
        {college.girlsHostelImages?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Girls Hostel Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {college.girlsHostelImages.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Girls Hostel Image ${idx + 1}`}
                  className="rounded-xl w-full max-h-96 object-cover shadow-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Cutoffs (if available) */}
      {college.cutoffs && Object.keys(college.cutoffs).length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Cutoff Information
          </h2>
          <div className="text-gray-600">
            {Object.keys(college.cutoffs).map((category, idx) => (
              <p key={idx}>
                <strong className="font-medium text-gray-800">
                  {category}:
                </strong>{" "}
                {college.cutoffs[category]}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Video Links */}
      {(college.collegeTourVideo || college.studentReviewVideo) && (
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Videos</h2>
          {college.collegeTourVideo && (
            <div className="mb-4">
              <strong className="font-medium text-gray-800">
                College Tour:
              </strong>{" "}
              <a
                href={college.collegeTourVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {college.collegeTourVideo}
              </a>
            </div>
          )}
          {college.studentReviewVideo && (
            <div>
              <strong className="font-medium text-gray-800">
                Student Review:
              </strong>{" "}
              <a
                href={college.studentReviewVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {college.studentReviewVideo}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollegeDetail;
