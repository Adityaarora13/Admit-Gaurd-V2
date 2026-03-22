export const saveSubmission = (result, applicantData) => {
  const submissions = getAllSubmissions();
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    applicant_name: applicantData.full_name,
    email: applicantData.email,
    tier: result.tier,
    risk_score: result.risk_score,
    category: result.category.category,
    flags: result.flags || [],
    anomalies: result.anomalies || []
  };
  submissions.push(entry);
  localStorage.setItem('ag_submissions', JSON.stringify(submissions));
  return entry;
};

export const getAllSubmissions = () => {
  const data = localStorage.getItem('ag_submissions');
  return data ? JSON.parse(data) : [];
};

export const clearAll = () => {
  localStorage.removeItem('ag_submissions');
};
