export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  distance: string;
  salary: string;
  experience: string;
  type: "Full Time" | "Part Time" | "Contract";
  skills: string[];
  postedDate: string;
  description: string;
  isUrgent?: boolean;
}

export interface JobApplicant {
  id: string;
  name: string;
  phone: string;
  location: string;
  distance: string;
  experience: string;
  currentSalary: string;
  expectedSalary: string;
  skills: string[];
  appliedDate: string;
  status: "New" | "Shortlisted" | "Interview" | "Rejected";
  education: string;
  avatar?: string;
}

export const JOBS: Job[] = [
  {
    id: "1",
    title: "Roll Forming Machine Operator",
    company: "Sai Rolotech",
    location: "Rajkot, Gujarat",
    distance: "2 km",
    salary: "₹15,000 - ₹25,000/mo",
    experience: "2-4 years",
    type: "Full Time",
    skills: ["Roll Forming", "PLC Operation", "Quality Check"],
    postedDate: "2 days ago",
    description: "Operate and maintain roll forming machines for production of roofing sheets and structural profiles.",
    isUrgent: true,
  },
  {
    id: "2",
    title: "CNC Machine Programmer",
    company: "Gujarat Steel Works",
    location: "Morbi, Gujarat",
    distance: "45 km",
    salary: "₹20,000 - ₹35,000/mo",
    experience: "3-5 years",
    type: "Full Time",
    skills: ["CNC Programming", "AutoCAD", "G-Code"],
    postedDate: "5 days ago",
    description: "Program and operate CNC machines for precision steel parts manufacturing.",
  },
  {
    id: "3",
    title: "Maintenance Technician",
    company: "Sai Rolotech",
    location: "Rajkot, Gujarat",
    distance: "3 km",
    salary: "₹12,000 - ₹20,000/mo",
    experience: "1-3 years",
    type: "Full Time",
    skills: ["Electrical", "Mechanical", "PLC Troubleshooting"],
    postedDate: "1 week ago",
    description: "Perform preventive and corrective maintenance on industrial roll forming machinery.",
  },
  {
    id: "4",
    title: "Sales Engineer",
    company: "Industrial Machines Ltd",
    location: "Ahmedabad, Gujarat",
    distance: "220 km",
    salary: "₹25,000 - ₹45,000/mo",
    experience: "2-5 years",
    type: "Full Time",
    skills: ["B2B Sales", "Machine Knowledge", "Client Relations"],
    postedDate: "3 days ago",
    description: "Sell industrial machinery to manufacturing companies across Gujarat and Rajasthan.",
  },
  {
    id: "5",
    title: "Welding Supervisor",
    company: "Patel Fabrication",
    location: "Rajkot, Gujarat",
    distance: "8 km",
    salary: "₹18,000 - ₹28,000/mo",
    experience: "4-6 years",
    type: "Full Time",
    skills: ["MIG Welding", "TIG Welding", "Team Management"],
    postedDate: "4 days ago",
    description: "Supervise welding operations and ensure quality standards in steel fabrication.",
    isUrgent: true,
  },
  {
    id: "6",
    title: "Quality Inspector",
    company: "Sai Rolotech",
    location: "Rajkot, Gujarat",
    distance: "2 km",
    salary: "₹14,000 - ₹22,000/mo",
    experience: "1-2 years",
    type: "Part Time",
    skills: ["Quality Control", "Measurement Tools", "ISO Standards"],
    postedDate: "6 days ago",
    description: "Inspect finished products for quality compliance and dimensional accuracy.",
  },
];

export const JOB_APPLICANTS: JobApplicant[] = [
  {
    id: "1",
    name: "Ramesh Vaghela",
    phone: "+91 98765 43210",
    location: "Rajkot, Gujarat",
    distance: "5 km",
    experience: "4 years",
    currentSalary: "₹18,000/mo",
    expectedSalary: "₹25,000/mo",
    skills: ["Roll Forming", "PLC Operation", "Maintenance"],
    appliedDate: "2 days ago",
    status: "New",
    education: "ITI - Mechanical",
  },
  {
    id: "2",
    name: "Suresh Patel",
    phone: "+91 99887 76655",
    location: "Morbi, Gujarat",
    distance: "40 km",
    experience: "6 years",
    currentSalary: "₹22,000/mo",
    expectedSalary: "₹30,000/mo",
    skills: ["CNC Programming", "AutoCAD", "G-Code", "Welding"],
    appliedDate: "3 days ago",
    status: "Shortlisted",
    education: "Diploma - Mechanical Engg.",
  },
  {
    id: "3",
    name: "Mahesh Joshi",
    phone: "+91 97654 32100",
    location: "Rajkot, Gujarat",
    distance: "3 km",
    experience: "2 years",
    currentSalary: "₹12,000/mo",
    expectedSalary: "₹18,000/mo",
    skills: ["Electrical", "PLC Troubleshooting"],
    appliedDate: "5 days ago",
    status: "Interview",
    education: "ITI - Electrical",
  },
  {
    id: "4",
    name: "Dinesh Solanki",
    phone: "+91 98123 45678",
    location: "Jamnagar, Gujarat",
    distance: "90 km",
    experience: "8 years",
    currentSalary: "₹28,000/mo",
    expectedSalary: "₹35,000/mo",
    skills: ["MIG Welding", "TIG Welding", "Team Management", "Quality Check"],
    appliedDate: "1 week ago",
    status: "New",
    education: "B.Tech - Mechanical",
  },
  {
    id: "5",
    name: "Kiran Bhatt",
    phone: "+91 99554 33221",
    location: "Rajkot, Gujarat",
    distance: "6 km",
    experience: "1 year",
    currentSalary: "₹10,000/mo",
    expectedSalary: "₹15,000/mo",
    skills: ["Quality Control", "Measurement Tools"],
    appliedDate: "4 days ago",
    status: "New",
    education: "ITI - Fitter",
  },
];

export const SALARY_FILTERS = ["All", "₹10K-15K", "₹15K-25K", "₹25K-35K", "₹35K+"];
export const EXPERIENCE_FILTERS = ["All", "0-2 yrs", "2-5 yrs", "5-8 yrs", "8+ yrs"];
export const DISTANCE_FILTERS = ["All", "< 10 km", "10-50 km", "50-100 km", "100+ km"];
