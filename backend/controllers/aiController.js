const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateContent = async (req, res) => {
  try {
    const { type, data } = req.body;
    let prompt = '';

    if (type === 'summary') {
      prompt = `Write a professional resume summary for: Name: ${data.name}, Role: ${data.role}, Skills: ${data.skills?.join(', ')}, Experience: ${data.experience} years. Keep it 3-4 sentences, impactful and ATS-friendly.`;
    } else if (type === 'experience') {
      prompt = `Write 4-5 strong bullet points for this work experience: Position: ${data.position} at ${data.company}. Responsibilities: ${data.responsibilities}. Use action verbs and quantify achievements where possible.`;
    } else if (type === 'project') {
      prompt = `Write a compelling 2-3 sentence project description for: Project: ${data.name}, Technologies: ${data.technologies}, What it does: ${data.description}. Make it resume-ready and impactful.`;
    } else if (type === 'skills') {
      prompt = `Given these skills: ${data.skills?.join(', ')} for a ${data.role} role, suggest 5 additional relevant skills and group all skills into categories.`;
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert resume writer and career coach.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};