const runPanelEvaluation = require('../orchestrator/panelOrchestrator');
const buildFinalReport = require('../report_generator/reportGenerator');

/**
 * Evaluation Service - Integrates with existing multi-agent system
 */
class EvaluationService {
  /**
   * Evaluate a candidate using the multi-agent panel
   * @param {string} resume - Candidate's resume text
   * @param {string} transcript - Interview transcript
   * @param {string} jobDescription - Target job description
   * @returns {Promise<object>} - Evaluation results
   */
  async evaluateCandidate(resume, transcript = '', jobDescription) {
    try {
      // Validate inputs
      if (!resume || !jobDescription) {
        throw new Error('Resume and jobDescription are required');
      }

      // Prepare input data for the panel
      const inputData = {
        resume: resume,
        transcript: transcript,
        jobDescription: jobDescription
      };

      console.log('Starting panel evaluation...');
      
      // Run the multi-agent evaluation panel
      const panelResult = await runPanelEvaluation(inputData);

      console.log('Panel evaluation complete, building final report...');
      
      // Build the final structured report
      const finalReport = buildFinalReport(panelResult);

      return finalReport;
    } catch (error) {
      console.error('Evaluation service error:', error);
      throw new Error('Failed to evaluate candidate: ' + error.message);
    }
  }

  /**
   * Evaluate with custom agent configuration
   * @param {object} options - Evaluation options
   * @returns {Promise<object>} - Evaluation results
   */
  async evaluateWithOptions(options) {
    const {
      resume,
      transcript = '',
      jobDescription,
      agents = ['technical', 'resume', 'behavioral', 'claim'],
      weights = null
    } = options;

    if (!resume || !jobDescription) {
      throw new Error('Resume and jobDescription are required');
    }

    // This can be extended to support custom agent selection and weights
    return this.evaluateCandidate(resume, transcript, jobDescription);
  }

  /**
   * Get evaluation summary
   * @param {object} evaluationResult - Full evaluation result
   * @returns {object} - Summary object
   */
  getSummary(evaluationResult) {
    if (!evaluationResult) {
      return null;
    }

    return {
      overallScore: evaluationResult.overallScore || evaluationResult.finalScore || 0,
      recommendation: evaluationResult.recommendation || evaluationResult.finalRecommendation || 'No Hire',
      confidence: evaluationResult.confidenceLevel || 'low',
      keyStrengths: evaluationResult.strengths ? evaluationResult.strengths.slice(0, 3) : [],
      keyConcerns: evaluationResult.concerns ? evaluationResult.concerns.slice(0, 3) : [],
      agentBreakdown: {
        technical: evaluationResult.technical?.score || 0,
        resume: evaluationResult.resume?.score || 0,
        behavioral: evaluationResult.behavioral?.score || 0,
        claims: evaluationResult.claims?.score || 0
      }
    };
  }
}

module.exports = new EvaluationService();
