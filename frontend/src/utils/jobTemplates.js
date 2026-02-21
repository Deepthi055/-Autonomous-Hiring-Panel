// Job Description templates for each role

export const JD_TEMPLATES = {
  'Backend Engineer': `We are looking for an experienced Backend Engineer to join our growing team.

Responsibilities:
- Design and implement scalable RESTful APIs and microservices
- Work with databases (PostgreSQL, MongoDB, Redis) to ensure high performance
- Collaborate with frontend teams on integration points
- Implement CI/CD pipelines and deployment automation
- Write clean, maintainable, and well-documented code

Requirements:
- 3+ years of backend development experience
- Proficiency in Node.js, Python, or Go
- Experience with cloud platforms (AWS, GCP, Azure)
- Strong understanding of Docker and Kubernetes
- Familiarity with message queues (Kafka, RabbitMQ)
- Experience with SQL and NoSQL databases`,

  'Frontend Engineer': `We are seeking a talented Frontend Engineer to build exceptional user interfaces.

Responsibilities:
- Build responsive, accessible, and performant web applications
- Implement pixel-perfect UI designs using React and TypeScript
- Optimize applications for maximum speed and scalability
- Collaborate with UX designers and backend engineers
- Write unit and integration tests for UI components

Requirements:
- 3+ years of frontend development experience
- Proficiency in React, TypeScript, and modern JavaScript
- Experience with state management (Redux, Zustand, Recoil)
- Strong knowledge of CSS, HTML5, and web accessibility standards
- Familiarity with Webpack, Vite, and performance optimization
- Experience with testing frameworks (Jest, Cypress, Playwright)`,

  'Data Engineer': `We are hiring a Data Engineer to design and maintain our data infrastructure.

Responsibilities:
- Design, build, and maintain data pipelines and ETL processes
- Work with large-scale data processing frameworks (Spark, Flink)
- Manage data warehouses (Snowflake, BigQuery, Redshift)
- Implement data quality checks and monitoring
- Collaborate with data scientists and analysts

Requirements:
- 3+ years of data engineering experience
- Proficiency in Python and SQL
- Experience with Apache Spark, Airflow, and dbt
- Strong knowledge of cloud data services (AWS Glue, GCP Dataflow)
- Experience with streaming data platforms (Kafka, Kinesis)
- Familiarity with data modeling and dimensional design`,

  'AI/ML Engineer': `We are looking for an AI/ML Engineer to develop intelligent systems and models.

Responsibilities:
- Design and implement machine learning models for production use cases
- Work with large language models (LLMs) and fine-tuning pipelines
- Build and maintain ML training infrastructure and model serving
- Deploy models at scale using MLOps best practices
- Collaborate with product and research teams

Requirements:
- 3+ years of ML engineering experience
- Proficiency in Python, PyTorch, or TensorFlow
- Experience with LLMs (GPT-4, Claude, Llama) and prompt engineering
- Knowledge of MLflow, Weights & Biases, or similar tools
- Familiarity with vector databases (Pinecone, Weaviate, Chroma)
- Strong understanding of model evaluation and A/B testing`,

  'DevOps Engineer': `We are seeking a DevOps Engineer to build and manage our cloud infrastructure.

Responsibilities:
- Design and implement CI/CD pipelines and deployment workflows
- Manage Kubernetes clusters and container orchestration
- Implement infrastructure as code using Terraform or Pulumi
- Monitor system performance, availability, and security
- Collaborate with development teams to improve deployment processes

Requirements:
- 3+ years of DevOps or SRE experience
- Proficiency with Kubernetes, Docker, and Helm
- Experience with cloud platforms (AWS, GCP, Azure)
- Strong knowledge of Terraform, Ansible, or similar IaC tools
- Experience with monitoring tools (Prometheus, Grafana, DataDog)
- Familiarity with security best practices and compliance frameworks`,
};

export const ROLES = [
  { id: 'Backend Engineer', label: 'Backend Engineer', icon: 'Server' },
  { id: 'Frontend Engineer', label: 'Frontend Engineer', icon: 'Monitor' },
  { id: 'Data Engineer', label: 'Data Engineer', icon: 'Database' },
  { id: 'AI/ML Engineer', label: 'AI/ML Engineer', icon: 'Brain' },
  { id: 'DevOps Engineer', label: 'DevOps Engineer', icon: 'Cloud' },
];
