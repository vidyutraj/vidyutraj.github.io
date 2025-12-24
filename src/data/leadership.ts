export interface Leadership {
  organization: string;
  position: string;
  startDate: string; // Format: "YYYY-MM" or "YYYY-MM-DD"
  endDate: string | null; // Format: "YYYY-MM" or "YYYY-MM-DD", null for current position
  location?: string;
  description?: string[]; // Optional description bullets
  achievements?: string[]; // Optional achievements or highlights
  logo?: string; // Path to organization logo image
  logoAlt?: string; // Alt text for logo
  website?: string; // Organization website URL
}

export const leadership: Leadership[] = [
  {
    organization: '180 Degrees Consulting',
    position: 'Client Acquisition Executive Director',
    startDate: '2025-04',
    endDate: null,
    location: 'Atlanta, GA',
    description: [
      'Drove client growth: Engaged 10-20 organizations weekly, securing 9+ new client projects per quarter across healthcare, education, and tech',
      'Closed deals end-to-end: Oversee the full workflow from initial contact, pitch meetings, scoping, and defining scope of work, to finalizing contracts and onboarding clients',
    ],
    logo: '/logos/180.png',
    logoAlt: '180 Degrees Consulting logo',
  },
  {
    organization: 'Big Data Big Impact',
    position: 'Vice-President',
    startDate: '2025-08',
    endDate: null,
    location: 'Atlanta, GA',
    description: [
      'Spearheaded the Launchpad initiative, guiding 10-15 student teams to pitch, develop, and lead College of Computing-funded AI/ML projects; managed the selection process, provided mentorship, and led workshops',
      'Conducted meetings with corporate sponsors, Georgia Tech student organizations, and 30+ Big Data Big Impact board members',
    ],
    logo: '/logos/bigdata.png',
    logoAlt: 'Big Data Big Impact logo',
  },
];

