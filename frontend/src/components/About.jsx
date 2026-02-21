import { ArrowLeft, Brain, FileText, Code, Users, ShieldCheck, BarChart3, Zap, Target, TrendingUp } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export default function About({ onBack }) {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-40 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              VerdictAI by DataVex
            </h1>
          </div>
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              isDark
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      </div>


      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {/* About DataVex */}
        <section className="space-y-6">
          <div className="text-center space-y-4 mb-8">
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              About DataVex
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
              DataVex is a visionary technology company specializing in AI, data science, cloud infrastructure, and digital transformation. We blend cutting-edge research with scalable product development to solve real-world industry challenges.
            </p>
          </div>

          <div className={`p-8 rounded-xl ${isDark ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/50' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'}`}>
            <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              Our Mission
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
              To empower businesses to harness the power of data and intelligent systems, creating measurable impact and driving sustainable growth. We are strategically positioned to help organizations navigate the complexities of digital transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Data-Driven Innovation
                </h4>
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Research-backed solutions with practical applications
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Practical Application
                </h4>
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                End-to-end technological expertise and product development
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Measurable Impact
                </h4>
              </div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Delivering results across industries with proven ROI
              </p>
            </div>
          </div>
        </section>

        {/* VerdictAI Section */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              VerdictAI: Intelligent Candidate Evaluation
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Our flagship AI-powered solution revolutionizes hiring by combining five specialized evaluation agents into one unified verdict. Using advanced LLMs, we provide comprehensive, objective candidate assessments that eliminate bias and deliver actionable insights.
            </p>
          </div>

          {/* Evaluation Agents */}
          <div className="space-y-4">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Our Evaluation Agents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Resume Agent */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-700/50' : 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <h4 className={`font-bold text-lg ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                    Resume Agent
                  </h4>
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Analyzes resume content, experience alignment, skills match, and career progression to provide comprehensive document assessment.
                </p>
              </div>

              {/* Technical Agent */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-700/50' : 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Code className="w-6 h-6 text-purple-500" />
                  <h4 className={`font-bold text-lg ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                    Technical Agent
                  </h4>
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Evaluates technical skills, certifications, project experience, and technological proficiency for role requirements.
                </p>
              </div>

              {/* Behavioral Agent */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-700/50' : 'bg-gradient-to-br from-green-50 to-green-100 border border-green-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-green-500" />
                  <h4 className={`font-bold text-lg ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                    Behavioral Agent
                  </h4>
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Assesses soft skills, cultural fit, leadership ability, and interpersonal qualities from provided information.
                </p>
              </div>

              {/* Claims Agent */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/30 border border-orange-700/50' : 'bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-orange-500" />
                  <h4 className={`font-bold text-lg ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                    Claims Agent
                  </h4>
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Verifies candidate claims, checks for consistency, and validates stated experiences and qualifications.
                </p>
              </div>

              {/* Consensus Agent */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-indigo-900/30 to-indigo-800/30 border border-indigo-700/50' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <BarChart3 className="w-6 h-6 text-indigo-500" />
                  <h4 className={`font-bold text-lg ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    Consensus Agent
                  </h4>
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Synthesizes all agent perspectives to provide a final verdict with confidence scoring and comprehensive recommendations.
                </p>
              </div>

              {/* AI Integration */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-slate-900/30 to-slate-800/30 border border-slate-700/50' : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-slate-500" />
                  <h4 className={`font-bold text-lg ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    AI-Powered Analysis
                  </h4>
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Each agent leverages advanced LLMs to provide deep analysis and contextual understanding of candidate profiles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why VerdictAI */}
        <section className="space-y-6">
          <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why Choose VerdictAI
          </h3>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-600">
                  <span className="text-white font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Multi-Dimensional Analysis
                </h4>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Five specialized agents provide comprehensive evaluation from different perspectives
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-600">
                  <span className="text-white font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Objective Assessment
                </h4>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  AI-powered analysis eliminates human bias from the evaluation process
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-green-600">
                  <span className="text-white font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Detailed Reports
                </h4>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Comprehensive evaluation reports with actionable insights and recommendations
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-orange-600">
                  <span className="text-white font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Confidence Scoring
                </h4>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Transparency with confidence levels for every evaluation metric
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600">
                  <span className="text-white font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Dark & Light Modes
                </h4>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Comfortable viewing experience with theme preference persistence
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-slate-600">
                  <span className="text-white font-bold">✓</span>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Interactive Visualizations
                </h4>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Charts and dashboards for easy understanding of evaluation results
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="space-y-6">
          <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Technology Stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                Frontend
              </h4>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• React 19.2.0 - Modern UI library</li>
                <li>• Vite 7.3.1 - Lightning-fast build tool</li>
                <li>• Tailwind CSS 3.4.1 - Utility-first styling</li>
                <li>• Recharts 2.10.3 - Interactive visualizations</li>
                <li>• Lucide React - Beautiful icon library</li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Backend & AI
              </h4>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Node.js & Express - Server framework</li>
                <li>• Advanced LLMs - AI-powered agents</li>
                <li>• RESTful API - Clean architecture</li>
                <li>• Multi-Agent System - Specialized evaluators</li>
                <li>• JSON Schema Validation - Input verification</li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                AI & Data Science
              </h4>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Custom LLM Models - Language models</li>
                <li>• Natural Language Processing - Text analysis</li>
                <li>• Machine Learning - Predictive scoring</li>
                <li>• Prompt Engineering - Optimized interactions</li>
                <li>• Data Privacy - Secure deployments</li>
              </ul>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h4 className={`font-bold mb-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                Infrastructure
              </h4>
              <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Cloud Platforms - AWS, GCP, Azure</li>
                <li>• Docker - Containerization</li>
                <li>• Kubernetes - Orchestration</li>
                <li>• CI/CD Pipelines - Automation</li>
                <li>• Monitoring & Analytics - Performance tracking</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DataVex Services */}
        <section className="space-y-6">
          <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            DataVex Core Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-700/50' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200'}`}>
              <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                Application Development
              </h4>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Full-stack development for enterprise-grade, cloud-native, and mobile-first solutions.
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-700/50' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'}`}>
              <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                AI & Data Analytics
              </h4>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Custom AI solutions, predictive analytics, deep learning models, and data privacy-focused deployments.
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-700/50' : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'}`}>
              <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-green-300' : 'text-green-700'}`}>
                Cloud & DevOps
              </h4>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Expertise in AWS, GCP, Azure. End-to-end CI/CD pipelines, automation, scalability, and cost optimization.
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border border-orange-700/50' : 'bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200'}`}>
              <h4 className={`font-bold text-lg mb-3 ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                Digital Transformation
              </h4>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Strategic IT consulting, process automation, and bespoke solutions to optimize your business operations.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="space-y-6">
          <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Leadership Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Rajesh Kotian
              </h4>
              <p className={`${isDark ? 'text-indigo-400' : 'text-indigo-600'} font-semibold mb-3`}>
                CEO & Founder
              </p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                20+ years in enterprise IT, project/program management, and AI strategy at global organizations like HCL, Wipro, and Credit Suisse.
              </p>
            </div>

            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sandesh Poojary
              </h4>
              <p className={`${isDark ? 'text-purple-400' : 'text-purple-600'} font-semibold mb-3`}>
                Director & Infra Lead
              </p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                Data Center Infrastructure Leader & Serial Entrepreneur with 20+ years delivering carrier-grade, mission-critical environments.
              </p>
            </div>

            <div className={`p-6 rounded-xl col-span-1 md:col-span-2 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sreekanth K Arimanithaya
              </h4>
              <p className={`${isDark ? 'text-green-400' : 'text-green-600'} font-semibold mb-3`}>
                Director, Advisor & Coach
              </p>
              <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                30+ years as Global CXO (EY, DXC, Britannia). Managing Partner at Singularity University (India), driving AI transformation and enterprise reinvention.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className={`pt-8 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} text-center space-y-3`}>
          <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            VerdictAI - Intelligent Candidate Evaluation Platform
          </h4>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by DataVex's Advanced AI & Data Science Expertise
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            © 2026 DataVex. All rights reserved. Transforming recruitment through intelligent automation.
          </p>
        </section>
      </main>
    </div>
  );
}
