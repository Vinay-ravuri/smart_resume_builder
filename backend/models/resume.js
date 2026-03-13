const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'My Resume' },
  template: { type: String, enum: ['modern', 'minimal', 'professional'], default: 'modern' },
  personalInfo: {
    fullName: String, email: String, phone: String,
    location: String, linkedin: String, website: String,
  },
  summary: String,
  education: [{
    institution: String, degree: String, field: String,
    startDate: String, endDate: String, gpa: String,
  }],
  experience: [{
    company: String, position: String, location: String,
    startDate: String, endDate: String, description: String, current: Boolean,
  }],
  skills: [String],
  projects: [{
    name: String, description: String, technologies: [String], link: String,
  }],
  achievements: [String],
  certifications: [{
    name: String, issuer: String, date: String, link: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);