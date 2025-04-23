const mongoose = require('mongoose');

const seatMatrixSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  seats: { type: Number, required: true },
});

const companyDataSchema = new mongoose.Schema({
  name: { type: String, },
  offers: { type: Number, },
  ctc: { type: String, },
});

const collegeInfoSchema = new mongoose.Schema({
  collegeName: { type: String, required: true },
  counsellingNames: { type: String, },
  established: { type: String, },
  campus: { type: String, },
  location: { type: String, },
  nirfRanking: { type: String, },
  seatMatrix: { type: [seatMatrixSchema], required: true },
  totalCSStudents: { type: Number, },
  nbaBranches: { type: String, },
  profilePic: { type: String, required: true },
  collegeTourImages: { type: [String], },
  boysHostelImages: { type: [String], },
  girlsHostelImages: { type: [String], },
  collegeTourVideo: { type: String, },
  studentReviewVideo: { type: String, },
  cutoffs: { type: Object, },
  hostelFees: {
    boys: { type: String, },
    girls: { type: String, },
  },
  academicFees: {
    year1: { type: String, },
    year2: { type: String, },
    year3: { type: String, },
    year4: { type: String, },
    total: { type: String, },
  },
  totalFees: { type: String, },
  placements: {
    totalStudents: { type: String, },
    totalCompanies: { type: String, },
    totalOffers: { type: String, },
    highestPackage: { type: String, },
    avgPackage: { type: String, },
    csAvgPackage: { type: String, },
    companyData: { type: [companyDataSchema], },
  },
}, { timestamps: true });

const CollegeModel = mongoose.model('CollegeInfo', collegeInfoSchema);

module.exports = CollegeModel;
