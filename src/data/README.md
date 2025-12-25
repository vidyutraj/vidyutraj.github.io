# Portfolio Data Directory

This directory contains all the static content for your portfolio. Edit these files to update your portfolio content.

## File Structure

- **`personal.ts`** - Personal information, bio, stats, social links, resume paths
- **`projects.ts`** - Project listings with details, tech stacks, and links
- **`experience.ts`** - Work experience with roles, responsibilities, and technologies
- **`certifications.ts`** - Professional certifications
- **`education.ts`** - Education history
- **`leadership.ts`** - Leadership roles and organizations
- **`writing.ts`** - Blog posts and articles

## How to Update Content

### Projects (`projects.ts`)

```typescript
{
  title: 'Your Project Name',
  category: 'Cybersecurity Labs', // or 'Cloud & DevOps', etc.
  description: 'Brief description',
  problem: 'What problem did it solve?',
  approach: 'How did you approach it?',
  outcome: 'What were the results?',
  techStack: ['Python', 'AWS', 'Terraform'],
  githubUrl: 'https://github.com/yourusername/repo',
  demoUrl: 'https://demo-url.com', // optional
  featured: true, // optional, highlights important projects
}
```

### Personal Info (`personal.ts`)

Update your bio, stats, social links, and resume information here. All components reference this file automatically.

### Experience (`experience.ts`)

Add your work experience entries:

```typescript
{
  company: 'Company Name',
  position: 'Job Title',
  location: 'City, State',
  startDate: '2024-01',
  endDate: null, // null for current position
  description: [
    'Achievement or responsibility 1',
    'Achievement or responsibility 2',
  ],
  technologies: ['Python', 'AWS'],
  achievements: ['Optional achievement'], // optional
}
```

### Writing (`writing.ts`)

Add your blog posts and articles:

```typescript
{
  title: 'Article Title',
  description: 'Brief summary',
  date: '2024-01-15', // YYYY-MM-DD format
  readTime: '12 min',
  url: 'https://medium.com/@yourusername/article',
  tags: ['Tag1', 'Tag2'],
}
```

## Benefits

- ✅ **Clean separation** - Content separate from presentation
- ✅ **Easy updates** - Just edit the data files
- ✅ **Type-safe** - TypeScript ensures data structure consistency
- ✅ **Reusable** - Import anywhere you need the data
- ✅ **Version control friendly** - Easy to track changes

## Next Steps

1. Update `projects.ts` with your real projects
2. Add your work experience to `experience.ts`
3. Update `writing.ts` with your actual articles
4. Customize `personal.ts` with your details

No need to touch component files - they automatically use this data!

