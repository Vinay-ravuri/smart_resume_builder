const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateContent,
  checkATS,
  generateCoverLetter,
  matchJob,
  analyzeSkillGap,
  generateInterviewQuestions
} = require('../controllers/aiController');

router.post('/generate', protect, generateContent);
router.post('/ats-check', protect, checkATS);
router.post('/cover-letter', protect, generateCoverLetter);
router.post('/match-job', protect, matchJob);
router.post('/skill-gap', protect, analyzeSkillGap);
router.post('/interview-questions', protect, generateInterviewQuestions);

module.exports = router;