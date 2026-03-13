const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createResume, getResumes, getResumeById, updateResume, deleteResume } = require('../controllers/resumeController');
router.route('/').post(protect, createResume).get(protect, getResumes);
router.route('/:id').get(protect, getResumeById).put(protect, updateResume).delete(protect, deleteResume);
module.exports = router;