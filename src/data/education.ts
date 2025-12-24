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
  // Add your education here
  // Example:
  // {
  //   institution: 'Georgia Institute of Technology',
  //   degree: 'Bachelor of Science',
  //   fieldOfStudy: 'Computer Engineering',
  //   startDate: '2023-08',
  //   endDate: '2027-05',
  //   location: 'Atlanta, GA',
  //   gpa: '3.8/4.0',
  //   honors: ['Dean\'s List'],
  //   coursework: ['Cybersecurity', 'Cloud Computing', 'Systems Design'],
  // },
];

