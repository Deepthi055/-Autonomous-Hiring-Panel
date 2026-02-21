// Mock AI question generator based on role and resume content

const TECHNICAL_QUESTIONS = {
    'Backend Engineer': [
        { text: 'Explain the differences between REST and GraphQL. When would you choose one over the other?', category: 'Technical' },
        { text: 'How do you handle database transactions across microservices to maintain data consistency?', category: 'System Design' },
        { text: 'Describe your approach to designing a rate-limiting system for a high-traffic API.', category: 'System Design' },
        { text: 'What strategies do you use to optimize slow SQL queries in production?', category: 'Technical' },
        { text: 'Walk me through designing a distributed caching layer using Redis for a social media feed.', category: 'System Design' },
    ],
    'Frontend Engineer': [
        { text: 'Explain the React rendering lifecycle and how you prevent unnecessary re-renders.', category: 'Technical' },
        { text: 'How would you design a scalable component library for a large product team?', category: 'System Design' },
        { text: 'Describe your approach to handling complex state in a large React application.', category: 'Technical' },
        { text: 'How do you optimize a web application\'s Core Web Vitals (LCP, FID, CLS)?', category: 'Technical' },
        { text: 'Design a real-time collaborative document editor like Google Docs from the frontend perspective.', category: 'System Design' },
    ],
    'Data Engineer': [
        { text: 'Explain the difference between batch and stream processing. When would you use each?', category: 'Technical' },
        { text: 'How would you design a data pipeline to process 1TB of daily logs with low latency?', category: 'System Design' },
        { text: 'Describe your approach to handling schema evolution in data warehouses.', category: 'Technical' },
        { text: 'What strategies do you use to ensure data quality and consistency across pipelines?', category: 'Technical' },
        { text: 'Design a real-time analytics system for an e-commerce platform processing 1M events/day.', category: 'System Design' },
    ],
    'AI/ML Engineer': [
        { text: 'Explain the differences between fine-tuning and RAG approaches for LLM customization.', category: 'Technical' },
        { text: 'How would you approach reducing hallucinations in a production LLM application?', category: 'Technical' },
        { text: 'Design a scalable model serving infrastructure for a recommendation system.', category: 'System Design' },
        { text: 'Describe your approach to evaluating and monitoring ML models in production.', category: 'Technical' },
        { text: 'How would you build an AI-powered search system with semantic understanding?', category: 'System Design' },
    ],
    'DevOps Engineer': [
        { text: 'Design a zero-downtime deployment strategy for a critical production service.', category: 'System Design' },
        { text: 'How do you approach incident response and postmortem processes in a large engineering org?', category: 'Technical' },
        { text: 'Explain how you would implement a multi-region Kubernetes setup with failover.', category: 'System Design' },
        { text: 'Describe your approach to secrets management and security hardening in CI/CD pipelines.', category: 'Technical' },
        { text: 'How would you set up observability (metrics, logs, traces) for a microservices architecture?', category: 'Technical' },
    ],
};

const BEHAVIORAL_QUESTIONS = [
    { text: 'Describe a time when you disagreed with a technical decision. How did you handle it?', category: 'Behavioral' },
    { text: 'Tell me about a project where you had to learn a new technology quickly under pressure.', category: 'Behavioral' },
    { text: 'Share an example of when you mentored a junior developer and the impact it had.', category: 'Behavioral' },
    { text: 'Describe a situation where you had to balance technical debt with product delivery timelines.', category: 'Behavioral' },
    { text: 'Tell me about a time you identified and resolved a critical production issue.', category: 'Behavioral' },
];

const SYSTEM_DESIGN_EXTRA = [
    { text: 'Design a notification system that supports email, SMS, and push notifications at scale.', category: 'System Design' },
    { text: 'How would you architect a URL shortener service that handles 100M requests per day?', category: 'System Design' },
    { text: 'Design a distributed job scheduler with retry logic and monitoring.', category: 'System Design' },
];

export const generateQuestions = (role, resumeContent) => {
    const technical = TECHNICAL_QUESTIONS[role] || TECHNICAL_QUESTIONS['Backend Engineer'];
    const behavioral = BEHAVIORAL_QUESTIONS.slice(0, 2);

    // Extract tech mentions from resume
    const techs = extractTechStack(resumeContent, role);

    const questions = [...technical, ...behavioral];

    // Tag with extracted tech if found
    if (techs.length > 0) {
        questions[0] = {
            ...questions[0],
            text: questions[0].text,
            techContext: techs.slice(0, 3).join(', '),
        };
    }

    return questions.map((q, idx) => ({ ...q, id: `q-${idx + 1}` }));
};

export const generateMoreQuestions = (type, role) => {
    if (type === 'technical') {
        const qs = TECHNICAL_QUESTIONS[role] || TECHNICAL_QUESTIONS['Backend Engineer'];
        return qs.slice(2).map((q, idx) => ({ ...q, id: `extra-tech-${idx}` }));
    }
    if (type === 'behavioral') {
        return BEHAVIORAL_QUESTIONS.slice(2).map((q, idx) => ({ ...q, id: `extra-beh-${idx}` }));
    }
    if (type === 'system') {
        return SYSTEM_DESIGN_EXTRA.map((q, idx) => ({ ...q, id: `extra-sd-${idx}` }));
    }
    return [];
};

export const extractTechStack = (resumeContent, role) => {
    if (!resumeContent) return [];

    const allTechs = [
        'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Python', 'Node.js',
        'Go', 'Rust', 'Java', 'Kotlin', 'Swift', 'AWS', 'GCP', 'Azure', 'Docker',
        'Kubernetes', 'Terraform', 'PostgreSQL', 'MongoDB', 'Redis', 'Kafka',
        'Spark', 'Airflow', 'dbt', 'Snowflake', 'BigQuery', 'PyTorch', 'TensorFlow',
        'LangChain', 'FastAPI', 'GraphQL', 'gRPC', 'Prometheus', 'Grafana',
    ];

    return allTechs.filter(tech =>
        resumeContent.toLowerCase().includes(tech.toLowerCase())
    );
};

export const generateEvaluation = (role, resumeContent, transcript) => {
    // Mock evaluation scores with slight randomization
    const base = 0.7 + Math.random() * 0.2;
    const resumeScore = Math.min(0.95, base + Math.random() * 0.1);
    const technicalScore = Math.min(0.92, base - 0.05 + Math.random() * 0.15);
    const behavioralScore = Math.min(0.95, base + Math.random() * 0.12);
    const claimsScore = Math.min(0.98, base + 0.05 + Math.random() * 0.08);
    const finalScore = (resumeScore + technicalScore + behavioralScore + claimsScore) / 4;
    const skillAlignment = Math.round(60 + Math.random() * 35);

    const techs = extractTechStack(resumeContent, role);

    return {
        resume: {
            score: resumeScore,
            strengths: [
                `Strong experience profile for ${role}`,
                'Clear career progression documented',
                techs.length > 0 ? `Technical stack includes: ${techs.slice(0, 3).join(', ')}` : 'Solid technical foundation',
                'Achievements quantified with metrics',
            ],
            concerns: ['Some skill areas could be elaborated further'],
            gaps: ['DevOps exposure limited', 'Fewer open-source contributions visible'],
            contradictions: [],
        },
        technical: {
            score: technicalScore,
            strengths: [
                'Demonstrated problem-solving ability',
                'Solid understanding of system design principles',
                techs.length > 0 ? `Proficient in ${techs[0] || 'core technologies'}` : 'Broad technical competence',
            ],
            concerns: ['Advanced distributed systems concepts need deeper exploration'],
            gaps: ['Limited cloud-native architecture exposure'],
            contradictions: [],
        },
        behavioral: {
            score: behavioralScore,
            strengths: [
                'Strong communication and team collaboration',
                'Demonstrates ownership and accountability',
                'Evidence of cross-functional collaboration',
                'Proactive problem solver',
            ],
            concerns: ['Conflict resolution examples are limited'],
            gaps: ['Agile methodologies not explicitly mentioned'],
            contradictions: [],
        },
        claims: {
            score: claimsScore,
            strengths: [
                'Employment timeline appears consistent',
                'Certifications appear verifiable',
                'Project descriptions align with stated roles',
            ],
            concerns: [],
            gaps: [],
            contradictions: [],
        },
        consensus: {
            finalScore,
            confidenceLevel: 0.78 + Math.random() * 0.15,
            verdict: finalScore >= 0.75 ? 'Hire' : 'No Hire',
            summary: finalScore >= 0.75
                ? `Strong candidate for the ${role} position. Demonstrates solid technical foundation and good cultural fit. Recommend proceeding to final interview rounds.`
                : `Candidate shows potential for ${role} but has some skill gaps. Consider for a junior-level variant or encourage re-application after upskilling.`,
            skillAlignment,
        },
    };
};

export const generateChatResponse = (message, role, currentQuestions) => {
    const lower = message.toLowerCase();

    if (lower.includes('technical') || lower.includes('more question')) {
        return {
            text: `Generated additional technical questions for ${role}:`,
            questions: [
                { id: `chat-${Date.now()}-1`, text: `Explain how you would debug a memory leak in a ${role.includes('Frontend') ? 'React' : 'Node.js'} application in production.`, category: 'Technical' },
                { id: `chat-${Date.now()}-2`, text: `What are the trade-offs between synchronous and asynchronous processing in your tech stack?`, category: 'Technical' },
                { id: `chat-${Date.now()}-3`, text: `How do you ensure code quality and maintainability in a fast-moving team?`, category: 'Technical' },
            ],
        };
    }

    if (lower.includes('system design') || lower.includes('architecture')) {
        return {
            text: 'Here are system design questions:',
            questions: [
                { id: `chat-${Date.now()}-1`, text: 'Design a real-time leaderboard system that scales to millions of concurrent users.', category: 'System Design' },
                { id: `chat-${Date.now()}-2`, text: 'How would you architect a distributed file storage service like Dropbox?', category: 'System Design' },
                { id: `chat-${Date.now()}-3`, text: 'Design a global content delivery network (CDN) from scratch.', category: 'System Design' },
            ],
        };
    }

    if (lower.includes('behavioral') || lower.includes('soft skill')) {
        return {
            text: 'Added behavioral assessment questions:',
            questions: [
                { id: `chat-${Date.now()}-1`, text: 'Tell me about a time you led a team through a major technical migration. What was your approach?', category: 'Behavioral' },
                { id: `chat-${Date.now()}-2`, text: 'Describe how you handle shifting priorities and frequent context switching.', category: 'Behavioral' },
                { id: `chat-${Date.now()}-3`, text: 'Share an example of a time you influenced a technical decision without formal authority.', category: 'Behavioral' },
            ],
        };
    }

    if (lower.includes('tech stack') || lower.includes('technology')) {
        return {
            text: `Generated questions based on the candidate's detected tech stack:`,
            questions: [
                { id: `chat-${Date.now()}-1`, text: 'Walk me through the most complex technical challenge you\'ve solved using your primary stack.', category: 'Technical' },
                { id: `chat-${Date.now()}-2`, text: 'How do you stay current with rapidly evolving technologies in your domain?', category: 'Technical' },
                { id: `chat-${Date.now()}-3`, text: 'Describe a time when you had to choose between two competing technical approaches.', category: 'Technical' },
            ],
        };
    }

    return {
        text: `I can help generate different types of questions. Try asking for:\n- "Generate more technical questions"\n- "Give system design questions"\n- "Add behavioral questions"\n- "Generate questions based on tech stack"`,
        questions: [],
    };
};

export const mockTranscribe = (duration) => {
    const samples = [
        "So for the system design question, I would start by breaking down the requirements into functional and non-functional requirements. For scalability, I'd consider a microservices architecture with a load balancer at the front. I'd use Redis for caching frequently accessed data and PostgreSQL for persistent storage with read replicas for high read throughput.",
        "In terms of my experience with React, I've built large-scale SPAs with complex state management using Redux Toolkit. I'm familiar with performance optimization techniques like code splitting, lazy loading, and memoization with useMemo and useCallback. I've also implemented custom hooks extensively to abstract complex logic.",
        "When I encountered the distributed transaction problem at my previous company, we implemented the Saga pattern to manage microservice coordination. We used Kafka as the event bus with exactly-once semantics to ensure data consistency across services without tight coupling.",
    ];
    return samples[Math.floor(Math.random() * samples.length)];
};
