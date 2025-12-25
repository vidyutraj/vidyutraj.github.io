export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string; // Optional field of study or major
  startDate: string; // Format: "YYYY-MM" or "YYYY-MM-DD"
  endDate: string | null; // Format: "YYYY-MM" or "YYYY-MM-DD", null for current enrollment
  location: string;
  gpa?: string; // Optional GPA
  honors?: string[]; // Optional honors, awards, or distinctions
  coursework?: string[]; // Optional relevant coursework
  logo?: string; // Path to institution logo image
  logoAlt?: string; // Alt text for logo
  website?: string; // Institution website URL
}

export const education: Education[] = [
  {
    institution: 'Georgia Institute of Technology',
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Engineering',
    startDate: '2023-08',
    endDate: '2027-05',
    location: 'Atlanta, GA',
    gpa: '4.0',
    coursework: [
      'Data Structures & Algorithms',
      'Objects & Design',
      'Object-Oriented Programming',
      'Computer Systems Programming',
      'Computer Networking',
      'Computer Architecture',
      'FPGA Design',
      'Linear Algebra',
    ],
    logo: '/logos/GT.png',
    logoAlt: 'Georgia Tech Logo',
    website: 'https://www.gatech.edu',
  },
];

