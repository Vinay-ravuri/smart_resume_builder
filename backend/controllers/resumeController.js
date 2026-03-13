const Resume = require('../models/resume');

exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create({ ...req.body, user: req.user._id });
    res.status(201).json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort('-createdAt');
    res.json(resumes);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, req.body, { new: true }
    );
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ message: 'Resume deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};