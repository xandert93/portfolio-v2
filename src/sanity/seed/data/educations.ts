// seed-education.ts
import { type SanityDocumentLike } from 'sanity'

export const EDUCATIONS = [
  {
    _type: 'education',
    institution: {
      name: 'Westcliff High School for Boys',
      type: 'sixthForm',
      location: 'Westcliff-on-Sea, UK',
      logoFilename: 'whsb.png',
    },
    qualification: 'A-Levels',
    fieldOfStudy: undefined,
    grade: 'A*AAB',
    startYear: 2009,
    current: false,
    endYear: 2011,
    description: 'Studied Maths (AS), French, Biology and Chemistry (A2).',
    highlights: [
      'Maths (AS-Level) — A',
      'French (A2) — A*',
      'Biology (A2) — A',
      'Chemistry (A2) — B',
    ],
  },
  {
    institution: {
      name: 'University of Nottingham',
      type: 'university',
      location: 'Nottingham, UK',
      logoFilename: 'uon.png',
    },
    qualification: 'BA (Hons)',
    fieldOfStudy: 'Finance, Accounting and Management',
    grade: undefined,
    startYear: 2011,
    current: false,
    endYear: 2014,
  },
  {
    institution: {
      name: 'Masaryk University',
      type: 'university',
      location: 'Brno, Czech Republic',
      logoFilename: 'muni.webp',
    },
    qualification: 'MUDr. (incomplete)',
    fieldOfStudy: 'General Medicine',
    grade: undefined,
    startYear: 2015,
    current: false,
    endYear: 2017,
    description:
      'Completed two years of a six-year Medicine programme before deciding to pursue a different career path.',
  },
  {
    institution: {
      name: 'Kingston University',
      type: 'university',
      location: 'Kingston upon Thames, UK',
      logoFilename: 'ku.png',
    },
    qualification: 'PGCE',
    fieldOfStudy: 'Secondary Mathematics',
    grade: undefined,
    startYear: 2018,
    current: false,
    endYear: 2019,
  },
]
