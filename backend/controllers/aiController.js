const OpenAI = require('openai');

const getClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

exports.generateContent = async (req, res) => {
  try {
    const client = getClient();
    const { type, data } = req.body;
    let prompt = '';

    if (type === 'summary') {
      prompt = `Write a professional resume summary for:
Name: ${data.name}, Role: ${data.role},
Skills: ${data.skills?.join(', ')},
Experience: ${data.experience} years.
Keep it 3-4 sentences, impactful and ATS-friendly.`;
    } else if (type === 'experience') {
      prompt = `Write 4-5 strong bullet points for:
Position: ${data.position} at ${data.company}.
Responsibilities: ${data.responsibilities}.
Use action verbs and quantify achievements.`;
    } else if (type === 'project') {
      prompt = `Write a compelling 2-3 sentence project description for:
Project: ${data.name}, Technologies: ${data.technologies},
What it does: ${data.description}. Make it resume-ready.`;
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert resume writer.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (err) {
    if (err.message === 'OpenAI API key not configured') {
      return res.status(503).json({ message: 'AI service not configured. Please add OpenAI API key.' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.checkATS = async (req, res) => {
  try {
    const client = getClient();
    const { resume, jobDescription } = req.body;

    const prompt = `You are an ATS expert. Analyze this resume against the job description.
Return ONLY valid JSON, no extra text.

RESUME:
Name: ${resume.personalInfo?.fullName}
Summary: ${resume.summary}
Skills: ${resume.skills?.join(', ')}
Experience: ${resume.experience?.map(e => `${e.position} at ${e.company}: ${e.description}`).join('\n')}
Education: ${resume.education?.map(e => `${e.degree} from ${e.institution}`).join('\n')}
Projects: ${resume.projects?.map(p => `${p.name}: ${p.description}`).join('\n')}

JOB DESCRIPTION: ${jobDescription}

Return ONLY this JSON:
{
  "score": <0-100>,
  "rating": "<Excellent/Good/Fair/Poor>",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "sections": {
    "summary": <0-100>,
    "skills": <0-100>,
    "experience": <0-100>,
    "education": <0-100>
  }
}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an ATS expert. Always respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (err) {
    if (err.message === 'OpenAI API key not configured') {
      return res.status(503).json({ message: 'AI service not configured.' });
    }
    res.status(500).json({ message: 'ATS analysis failed: ' + err.message });
  }
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const client = getClient();
    const { resume, jobDescription, companyName, tone } = req.body;

    const prompt = `Write a professional cover letter for:
Candidate: ${resume.personalInfo?.fullName}
Email: ${resume.personalInfo?.email}
Skills: ${resume.skills?.join(', ')}
Experience: ${resume.experience?.map(e => `${e.position} at ${e.company}`).join(', ')}
Summary: ${resume.summary}
Company: ${companyName}
Job Description: ${jobDescription}
Tone: ${tone || 'professional'}

Write a compelling 3-paragraph cover letter under 300 words.
No placeholders. Ready to send.`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert cover letter writer.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (err) {
    if (err.message === 'OpenAI API key not configured') {
      return res.status(503).json({ message: 'AI service not configured.' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.matchJob = async (req, res) => {
  try {
    const client = getClient();
    const { resume, jobDescription } = req.body;

    const prompt = `Analyze how well this candidate matches the job.
CANDIDATE SKILLS: ${resume.skills?.join(', ')}
CANDIDATE EXPERIENCE: ${resume.experience?.map(e => `${e.position} at ${e.company}`).join(', ')}
JOB DESCRIPTION: ${jobDescription}

Return ONLY this JSON:
{
  "matchPercentage": <0-100>,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "recommendation": "<string>",
  "tailoringTips": ["tip1", "tip2", "tip3"]
}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a job matching expert. Respond with JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (err) {
    if (err.message === 'OpenAI API key not configured') {
      return res.status(503).json({ message: 'AI service not configured.' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.analyzeSkillGap = async (req, res) => {
  try {
    const client = getClient();
    const { currentSkills, targetRole, experienceLevel } = req.body;

    const prompt = `Analyze skill gaps for:
Current Skills: ${currentSkills?.join(', ')}
Target Role: ${targetRole}
Experience Level: ${experienceLevel}

Return ONLY this JSON:
{
  "currentSkillsRating": <0-100>,
  "skillsByCategory": {
    "technical": ["skill1", "skill2"],
    "tools": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"]
  },
  "missingCriticalSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1", "skill2"],
  "learningPath": [
    {"skill": "skill1", "resource": "resource1", "timeToLearn": "2 weeks"},
    {"skill": "skill2", "resource": "resource2", "timeToLearn": "1 month"}
  ],
  "estimatedTimeToReady": "<string>"
}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a career development expert. Respond with JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 800,
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (err) {
    if (err.message === 'OpenAI API key not configured') {
      return res.status(503).json({ message: 'AI service not configured.' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.generateInterviewQuestions = async (req, res) => {
  try {
    const client = getClient();
    const { resume, jobDescription, difficulty } = req.body;

    const prompt = `Generate interview questions for:
Role: ${resume.experience?.[0]?.position || 'Software Developer'}
Skills: ${resume.skills?.join(', ')}
Job Description: ${jobDescription}
Difficulty: ${difficulty || 'medium'}

Return ONLY this JSON:
{
  "technical": [
    {"question": "q1", "hint": "hint1", "difficulty": "easy/medium/hard"},
    {"question": "q2", "hint": "hint2", "difficulty": "easy/medium/hard"},
    {"question": "q3", "hint": "hint3", "difficulty": "easy/medium/hard"}
  ],
  "behavioral": [
    {"question": "q1", "hint": "hint1"},
    {"question": "q2", "hint": "hint2"},
    {"question": "q3", "hint": "hint3"}
  ],
  "roleSpecific": [
    {"question": "q1", "hint": "hint1"},
    {"question": "q2", "hint": "hint2"}
  ]
}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an interview preparation expert. Respond with JSON only.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch[0]);
    res.json(result);
  } catch (err) {
    if (err.message === 'OpenAI API key not configured') {
      return res.status(503).json({ message: 'AI service not configured.' });
    }
    res.status(500).json({ message: err.message });
  }
};