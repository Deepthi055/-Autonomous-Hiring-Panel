import { Briefcase, Code, Database, Cpu, Server, Palette, Shield, Cloud, Smartphone, TestTube, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';

const roles = [
  { id: 'backend', name: 'Backend Engineer', icon: Server, description: 'API, databases, server-side logic' },
  { id: 'frontend', name: 'Frontend Engineer', icon: Code, description: 'UI/UX, React, modern frameworks' },
  { id: 'data', name: 'Data Engineer', icon: Database, description: 'ETL, pipelines, data architecture' },
  { id: 'ai-ml', name: 'AI/ML Engineer', icon: Cpu, description: 'Machine learning, AI models, MLOps' },
  { id: 'devops', name: 'DevOps Engineer', icon: Briefcase, description: 'CI/CD, cloud infrastructure, K8s' },
  { id: 'fullstack', name: 'Full Stack Developer', icon: Code, description: 'End-to-end web development' },
  { id: 'mobile', name: 'Mobile Developer', icon: Smartphone, description: 'iOS, Android, React Native' },
  { id: 'ui-ux', name: 'UI/UX Designer', icon: Palette, description: 'User interface and experience' },
  { id: 'qa', name: 'QA Engineer', icon: TestTube, description: 'Testing, automation, quality' },
  { id: 'security', name: 'Security Engineer', icon: Shield, description: 'Cybersecurity, AppSec' },
  { id: 'cloud', name: 'Cloud Engineer', icon: Cloud, description: 'AWS, GCP, Azure infrastructure' },
  { id: 'product', name: 'Product Manager', icon: Briefcase, description: 'Product strategy and roadmap' },
];

const jdTemplates = {
  'backend': `We are looking for a Backend Engineer to join our team.

Requirements:
- 3+ years of experience with Python, Node.js, or Go
- Strong knowledge of RESTful APIs and GraphQL
- Experience with PostgreSQL, MongoDB, or Redis
- Understanding of microservices architecture
- Familiarity with cloud services (AWS/GCP/Azure)

Responsibilities:
- Design and implement scalable backend services
- Optimize database queries and performance
- Collaborate with frontend engineers on API design
- Write clean, maintainable, and testable code`,
  
  'frontend': `We are looking for a Frontend Engineer to join our team.

Requirements:
- 3+ years of experience with React, Vue, or Angular
- Strong knowledge of TypeScript and modern JavaScript
- Experience with state management (Redux, Context API)
- Understanding of responsive design and CSS frameworks
- Familiarity with frontend testing tools

Responsibilities:
- Build user interfaces that are fast and intuitive
- Collaborate with designers to implement pixel-perfect UIs
- Optimize application performance
- Write clean, reusable component code`,
  
  'data': `We are looking for a Data Engineer to join our team.

Requirements:
- 3+ years of experience with SQL and NoSQL databases
- Strong knowledge of Python and Scala
- Experience with ETL pipelines and data warehousing
- Familiarity with Spark, Kafka, or Airflow
- Understanding of data modeling best practices

Responsibilities:
- Design and build data pipelines
- Ensure data quality and consistency
- Optimize data storage and retrieval
- Collaborate with data scientists and analysts`,
  
  'ai-ml': `We are looking for an AI/ML Engineer to join our team.

Requirements:
- 3+ years of experience with machine learning frameworks
- Strong knowledge of Python, TensorFlow, or PyTorch
- Experience with MLOps and model deployment
- Understanding of NLP or computer vision
- Familiarity with cloud ML services

Responsibilities:
- Develop and deploy machine learning models
- Optimize model performance and efficiency
- Collaborate with data scientists on research
- Build scalable ML pipelines`,
  
  'devops': `We are looking for a DevOps Engineer to join our team.

Requirements:
- 3+ years of experience with CI/CD pipelines
- Strong knowledge of Docker and Kubernetes
- Experience with infrastructure as code (Terraform)
- Familiarity with cloud platforms (AWS/GCP/Azure)
- Understanding of monitoring and logging

Responsibilities:
- Build and maintain deployment infrastructure
- Automate build, test, and deployment processes
- Ensure system reliability and scalability
- Implement security best practices`,

  'fullstack': `We are looking for a Full Stack Developer to join our team.

Requirements:
- 3+ years of experience with both frontend and backend technologies
- Strong knowledge of JavaScript/TypeScript, React, Node.js
- Experience with databases (SQL and NoSQL)
- Understanding of RESTful APIs and microservices

Responsibilities:
- Build end-to-end web applications
- Collaborate with designers and backend engineers
- Optimize application performance
- Write clean, testable code`,

  'mobile': `We are looking for a Mobile Developer to join our team.

Requirements:
- 3+ years of experience with iOS or Android development
- Strong knowledge of Swift, Kotlin, or React Native
- Experience with mobile UI frameworks
- Understanding of mobile app architecture

Responsibilities:
- Build and maintain mobile applications
- Ensure app performance and quality
- Collaborate with design and backend teams
- Publish apps to App Store and Play Store`,

  'ui-ux': `We are looking for a UI/UX Designer to join our team.

Requirements:
- 3+ years of experience in UI/UX design
- Strong knowledge of Figma, Sketch, or Adobe XD
- Experience with user research and prototyping
- Understanding of design systems

Responsibilities:
- Create user-centered designs
- Conduct user research and testing
- Collaborate with developers
- Maintain design consistency`,

  'qa': `We are looking for a QA Engineer to join our team.

Requirements:
- 3+ years of experience in software testing
- Strong knowledge of testing methodologies
- Experience with test automation frameworks
- Familiarity with CI/CD pipelines

Responsibilities:
- Create and execute test plans
- Write automated test scripts
- Report and track bugs
- Ensure product quality`,

  'security': `We are looking for a Security Engineer to join our team.

Requirements:
- 3+ years of experience in cybersecurity
- Strong knowledge of security frameworks
- Experience with penetration testing
- Familiarity with compliance (SOC2, GDPR)

Responsibilities:
- Conduct security assessments
- Implement security measures
- Monitor for vulnerabilities
- Respond to security incidents`,

  'cloud': `We are looking for a Cloud Engineer to join our team.

Requirements:
- 3+ years of experience with cloud platforms
- Strong knowledge of AWS, GCP, or Azure
- Experience with infrastructure as code
- Understanding of cloud architecture

Responsibilities:
- Design and manage cloud infrastructure
- Optimize cloud costs
- Ensure cloud security
- Implement disaster recovery`,

  'product': `We are looking for a Product Manager to join our team.

Requirements:
- 3+ years of experience in product management
- Strong analytical and communication skills
- Experience with agile methodologies
- Understanding of user research

Responsibilities:
- Define product roadmap
- Work with engineering and design
- Analyze product metrics
- Communicate with stakeholders`,
};

export default function JobSetup({ onNext, onBack, data }) {
  const [jobDescription, setJobDescription] = useState(data?.jobDescription || '');
  const [selectedRole, setSelectedRole] = useState(data?.selectedRole || null);
  const [errors, setErrors] = useState({});

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (!jobDescription) {
      setJobDescription(jdTemplates[role.id] || '');
    }
    setErrors({ ...errors, role: null });
  };

  const handleContinue = () => {
    const newErrors = {};
    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    }
    if (!selectedRole) {
      newErrors.role = 'Please select a role';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext({
      jobDescription,
      selectedRole,
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Up Your Job Position</h2>
        <p className="text-gray-500">Enter the job details and select the role you're hiring for</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Job Description Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">A</div>
            <h3 className="font-semibold text-gray-700">Job Description</h3>
          </div>
          <div className="relative">
            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setErrors({ ...errors, jobDescription: null });
              }}
              placeholder="Provide detailed job requirements, responsibilities, and qualifications..."
              className={`
                w-full h-80 p-4 border-2 rounded-xl resize-none transition-all duration-200
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                ${errors.jobDescription 
                  ? 'border-rose-400 bg-rose-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            />
            {errors.jobDescription && (
              <p className="text-rose-500 text-sm mt-1">{errors.jobDescription}</p>
            )}
          </div>
          <p className="text-xs text-gray-400">
            Tip: Include specific requirements, tech stack, and experience level
          </p>
        </div>

        {/* Role Selection Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">B</div>
            <h3 className="font-semibold text-gray-700">Select Role</h3>
          </div>
          
          <div className="grid gap-3 max-h-[500px] overflow-y-auto pr-2">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole?.id === role.id;
              
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`
                    relative p-4 rounded-xl border-2 text-left transition-all duration-200
                    hover:shadow-md hover:border-indigo-300
                    ${isSelected 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}
                    `}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 whitespace-nowrap">{role.name}</div>
                      <div className="text-xs text-gray-500 truncate">{role.description}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {errors.role && (
            <p className="text-rose-500 text-sm">{errors.role}</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 whitespace-nowrap"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        )}
        <div className={onBack ? 'ml-auto' : ''}>
          <button
            onClick={handleContinue}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] whitespace-nowrap"
          >
            <span>Continue to Resume</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
