const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { generateContent } = require('../controllers/aiController');
router.post('/generate', protect, generateContent);
module.exports = router;