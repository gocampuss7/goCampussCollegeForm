import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const CollegeForm = () => {
  const [loading, setLoading] = useState({
    profilePic: false,
    collegeTourImages: false,
    boysHostelImages: false,
    girlsHostelImages: false,
    submit: false,
  });

  const initialState = {
    collegeName: "",
    counsellingNames: "",
    established: "",
    campus: "",
    location: "",
    nirfRanking: "",
    seatMatrix: [{ branch: "", seats: "" }],
    totalCSStudents: "",
    nbaBranches: "",
    profilePicFile: null,
    profilePic: "",
    collegeTourImages: [],
    collegeTourImagesFiles: [],
    boysHostelImages: [],
    boysHostelImagesFiles: [],
    girlsHostelImages: [],
    girlsHostelImagesFiles: [],
    collegeTourVideo: "",
    studentReviewVideo: "",
    cutoffs: {},
    hostelFees: { boys: "", girls: "" },
    academicFees: { year1: "", year2: "", year3: "", year4: "", total: "" },
    totalFees: "",
    placements: {
      totalStudents: "",
      totalCompanies: "",
      totalOffers: "",
      highestPackage: "",
      avgPackage: "",
      csAvgPackage: "",
      companyData: [{ name: "", offers: "", ctc: "" }],
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [backendAwake, setBackendAwake] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSeatMatrixChange = (idx, field, value) => {
    const updated = [...formData.seatMatrix];
    updated[idx][field] = value;
    setFormData((prev) => ({ ...prev, seatMatrix: updated }));
  };

  const wakeUpCallToBackend = async (retries = 3, delay = 2000) => {
    try {
      await axios.get(`${import.meta.env.VITE_backendUrl}`);
      setBackendAwake(true);
      // toast.success("Backend connected!");
    } catch (err) {
      if (retries === 0) {
        toast.error("Failed to connect to backend.");
        return;
      }
      setTimeout(() => {
        wakeUpCallToBackend(retries - 1, delay * 2);
      }, delay);
    }
  };

  if(!id){wakeUpCallToBackend();}

  const addSeatMatrixRow = () => {
    setFormData((prev) => ({
      ...prev,
      seatMatrix: [...prev.seatMatrix, { branch: "", seats: "" }],
    }));
  };

  const handleCompanyDataChange = (idx, field, value) => {
    const updated = [...formData.placements.companyData];
    updated[idx][field] = value;
    setFormData((prev) => ({
      ...prev,
      placements: { ...prev.placements, companyData: updated },
    }));
  };

  const addCompanyDataRow = () => {
    setFormData((prev) => ({
      ...prev,
      placements: {
        ...prev.placements,
        companyData: [
          ...prev.placements.companyData,
          { name: "", offers: "", ctc: "" },
        ],
      },
    }));
  };

  const handleSingleUpload = async (field, file) => {
    if (!file) return;
    setLoading((prev) => ({ ...prev, [field]: true }));
    const form = new FormData();
    form.append("image", file);
    const url = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMGBB_API_KEY
    }`;
    try {
      const res = await axios.post(url, form);
      const imgUrl = res.data.data.url;
      setFormData((prev) => ({ ...prev, [field]: imgUrl }));
      toast.success(`${field} uploaded successfully`);
    } catch (err) {
      console.error(`Error uploading ${field}:`, err);
      toast.error(`Failed to upload ${field}`);
    } finally {
      setLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleMultipleUpload = async (field, files) => {
    if (!files || files.length === 0) return;
    setLoading((prev) => ({ ...prev, [field]: true }));
    const urls = [];
    const url = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMGBB_API_KEY
    }`;
    for (const file of files) {
      const form = new FormData();
      form.append("image", file);
      try {
        const res = await axios.post(url, form);
        urls.push(res.data.data.url);
      } catch (err) {
        console.error(`Error uploading image for ${field}:`, err);
        toast.error(`Error uploading some images for ${field}`);
      }
    }
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ...urls],
    }));
    toast.success(`${field} images uploaded`);
    setLoading((prev) => ({ ...prev, [field]: false }));
  };

  const handleChange = (e, path = null) => {
    const { name, value } = e.target;
    if (path) {
      setFormData((prev) => {
        const updated = { ...prev };
        path.reduce((acc, key, i) => {
          if (i === path.length - 1) acc[key] = value;
          else acc[key] = { ...acc[key] };
          return acc[key];
        }, updated);
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.collegeName ||
      !formData.profilePic ||
      formData.seatMatrix.length === 0
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));

    try {
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_backendUrl}/api/college-info/${id}`,
          formData
        );
        toast.success("College info updated!");
        navigate(`/college/${id}`);
      } else {
        await axios.post(
          `${import.meta.env.VITE_backendUrl}/api/college-info`,
          formData
        );
        toast.success("College info submitted!");
      }
      setFormData(initialState);
      
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit college info");
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  useEffect(() => {
    if (id) {
      const fetchCollege = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_backendUrl}/api/college-info/${id}`);
          const data = res.data;
          setFormData({
            ...initialState,
            ...data,
          });
          setBackendAwake(true);
        } catch (err) {
          console.error("Failed to fetch college data:", err);
          toast.error("Could not load college data.");
        }
      };
      fetchCollege();
    }
  }, [id]);
  
  

  return (
    <>
      {!backendAwake ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl font-medium">
              Please wait while the backend wakes up...
            </p>
            <div className="loader mt-4" />
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-6 max-w-5xl mx-auto space-y-6 bg-white shadow-md rounded-md"
        >
          <h2 className="text-3xl font-bold text-center">
            {id ? "Edit College Info" : "Add College Info"}
          </h2>

          <input
            type="text"
            name="collegeName"
            placeholder="College Name *"
            required
            value={formData.collegeName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div className="space-y-2">
            <h3 className="font-semibold text-lg mt-4">Seat Matrix *</h3>
            {formData.seatMatrix.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Branch"
                  value={item.branch}
                  onChange={(e) =>
                    handleSeatMatrixChange(idx, "branch", e.target.value)
                  }
                  className="p-2 border rounded w-1/2"
                  required
                />
                <input
                  type="number"
                  placeholder="Seats"
                  value={item.seats}
                  onChange={(e) =>
                    handleSeatMatrixChange(idx, "seats", e.target.value)
                  }
                  className="p-2 border rounded w-1/2"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addSeatMatrixRow}
              className="text-blue-600 hover:underline"
            >
              + Add another
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="counsellingNames"
              placeholder="Counselling Names"
              value={formData.counsellingNames}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="established"
              placeholder="Established"
              value={formData.established}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="campus"
              placeholder="Campus"
              value={formData.campus}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="nirfRanking"
              placeholder="NIRF Ranking"
              value={formData.nirfRanking}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="totalCSStudents"
              placeholder="Total CS Students"
              value={formData.totalCSStudents}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="nbaBranches"
              placeholder="NBA Branches"
              value={formData.nbaBranches}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="collegeTourVideo"
              placeholder="College Tour Video (YouTube Link)"
              value={formData.collegeTourVideo}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="studentReviewVideo"
              placeholder="Student Review Video (YouTube Link)"
              value={formData.studentReviewVideo}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <input
              name="totalFees"
              placeholder="Total Fees"
              value={formData.totalFees}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg mt-4">Upload Images</h3>

            {/* Profile Picture */}
            <div className="mt-2">
              <label className="block font-medium">Profile Picture *</label>
              <input
                type="file"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profilePicFile: e.target.files[0],
                  }))
                }
              />
              <button
                type="button"
                onClick={() =>
                  handleSingleUpload("profilePic", formData.profilePicFile)
                }
                className="btn-primary mt-1"
                disabled={loading.profilePic}
              >
                {loading.profilePic ? "Uploading..." : "Upload Profile Pic"}
              </button>

              {formData.profilePic && (
                <img
                  src={formData.profilePic}
                  alt="Profile"
                  className="h-20 mt-2"
                />
              )}
            </div>

            {/* Multiple Uploads */}
            {[
              { label: "College Tour Images", field: "collegeTourImages" },
              { label: "Boys Hostel Images", field: "boysHostelImages" },
              { label: "Girls Hostel Images", field: "girlsHostelImages" },
            ].map(({ label, field }) => (
              <div key={field} className="mt-4">
                <label className="block font-medium">{label}</label>
                <input
                  multiple
                  type="file"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [`${field}Files`]: e.target.files,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    handleMultipleUpload(field, formData[`${field}Files`])
                  }
                  className="btn-primary mt-1"
                >
                  {loading[field] ? "Uploading..." : "Upload"}
                </button>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {formData[field]?.map((url, i) => (
                    <img key={i} src={url} alt="" className="h-16 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mt-6">Hostel Fees</h3>
            <div className="flex gap-2">
              <input
                placeholder="Boys"
                value={formData.hostelFees.boys}
                onChange={(e) => handleChange(e, ["hostelFees", "boys"])}
                className="p-2 border rounded w-1/2"
              />
              <input
                placeholder="Girls"
                value={formData.hostelFees.girls}
                onChange={(e) => handleChange(e, ["hostelFees", "girls"])}
                className="p-2 border rounded w-1/2"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mt-6">Academic Fees</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["year1", "year2", "year3", "year4", "total"].map((year) => (
                <input
                  key={year}
                  placeholder={year}
                  value={formData.academicFees[year]}
                  onChange={(e) => handleChange(e, ["academicFees", year])}
                  className="p-2 border rounded"
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mt-6">Placements</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                "totalStudents",
                "totalCompanies",
                "totalOffers",
                "highestPackage",
                "avgPackage",
                "csAvgPackage",
              ].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  value={formData.placements[field]}
                  onChange={(e) => handleChange(e, ["placements", field])}
                  className="p-2 border rounded"
                />
              ))}
            </div>
            <div className="mt-4">
              <h4 className="font-medium">Company Data</h4>
              {formData.placements.companyData.map((company, idx) => (
                <div key={idx} className="flex gap-2 my-1">
                  <input
                    placeholder="Company Name"
                    value={company.name}
                    onChange={(e) =>
                      handleCompanyDataChange(idx, "name", e.target.value)
                    }
                    className="p-2 border rounded w-1/3"
                  />
                  <input
                    placeholder="Offers"
                    value={company.offers}
                    onChange={(e) =>
                      handleCompanyDataChange(idx, "offers", e.target.value)
                    }
                    className="p-2 border rounded w-1/3"
                  />
                  <input
                    placeholder="CTC"
                    value={company.ctc}
                    onChange={(e) =>
                      handleCompanyDataChange(idx, "ctc", e.target.value)
                    }
                    className="p-2 border rounded w-1/3"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addCompanyDataRow}
                className="text-blue-600 hover:underline mt-2"
              >
                + Add Company
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading.submit}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            {loading.submit ? "Submitting..." : "Submit College Info"}
          </button>

          <ToastContainer position="top-right" />
        </form>
      )}
    </>
  );
};

export default CollegeForm;
