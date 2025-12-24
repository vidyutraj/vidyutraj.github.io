export interface Certification {
  name: string;
  issuer: string;
  issueDate: string; // Format: "YYYY-MM" or "YYYY-MM-DD"
  expirationDate?: string | null; // Format: "YYYY-MM" or "YYYY-MM-DD", null for no expiration
  credentialId?: string; // Optional credential ID or verification code
  credentialUrl?: string; // Optional URL to verify the certification
  logo?: string; // Path to issuer logo image
  logoAlt?: string; // Alt text for logo
}

export const certifications: Certification[] = [
  {
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: '2025-11',
    expirationDate: '2028-11',
    credentialUrl: 'https://www.credly.com/badges/4dcfc358-e312-4368-b7ac-8ae96d3a64f5/public_url',
    logo: '/logos/aws.png',
    logoAlt: 'AWS logo',
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services (AWS)',
    issueDate: '2025-01',
    expirationDate: '2028-01',
    credentialUrl: 'https://www.credly.com/badges/e331eac3-13e2-4fa2-8a2a-241065dc3788/linked_in_profile',
    logo: '/logos/aws.png',
    logoAlt: 'AWS logo',
  },
  {
    name: 'Multicloud Network Associate',
    issuer: 'Aviatrix',
    issueDate: '2024-10',
    expirationDate: '2027-10',
    credentialId: '2024-22187',
    credentialUrl: 'https://www.credly.com/badges/265ee8e9-73d0-48a7-b89d-e2fb49d3b881',
    logo: '/logos/aviatrix.png',
    logoAlt: 'Aviatrix logo',
  },
  {
    name: 'Microsoft Certified: Azure Fundamentals',
    issuer: 'Microsoft',
    issueDate: '2023-04',
    expirationDate: null,
    credentialUrl: 'https://www.credly.com/badges/6d9b916e-d9c0-4df3-80bf-0c5ff49bdecc/linked_in_profile',
    logo: '/logos/microsoft.png',
    logoAlt: 'Microsoft logo',
  },
];

