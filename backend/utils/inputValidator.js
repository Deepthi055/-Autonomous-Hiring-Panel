const validateInput = (body) => {
  const { resume, transcript, jobDescription } = body;

  if (!resume || !transcript || !jobDescription) {
    throw new Error("Resume, Transcript, and Job Description are required.");
  }

  return {
    resume: resume.trim(),
    transcript: transcript.trim(),
    jobDescription: jobDescription.trim(),
  };
};

module.exports = validateInput;