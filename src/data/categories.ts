import { Category, SubCategory, Topic } from '../types';

// ============================================
// CATEGORIES (Top Level)
// ============================================

export const categories: Category[] = [
  {
    id: 'cat-fundamentals',
    name: 'Fundamentals of Nursing',
    icon: '📋',
    description: 'Core nursing principles and skills',
    targetAudience: 'Nursing Students',
  },
  {
    id: 'cat-clinical-medicine',
    name: 'Clinical Medicine',
    icon: '🏥',
    description: 'Core clinical knowledge',
    targetAudience: 'Nursing & Medical Students',
  },
  {
    id: 'cat-nclex',
    name: 'NCLEX',
    icon: '🩺',
    description: 'NCLEX exam preparation',
    targetAudience: 'Nursing Students',
  },
  {
    id: 'cat-nmcn',
    name: 'NMCN',
    icon: '🇳🇬',
    description: 'NMCN exam preparation',
    targetAudience: 'Nursing Students (Nigeria)',
  },
];

// ============================================
// SUB-CATEGORIES (Linked to Categories)
// ============================================

export const subCategories: SubCategory[] = [
  // Fundamentals of Nursing
  { id: 'sub-basic-care', categoryId: 'cat-fundamentals', name: 'Basic Nursing Care', description: 'Essential nursing procedures', icon: '🛏️' },
  { id: 'sub-assessment', categoryId: 'cat-fundamentals', name: 'Health Assessment', description: 'Patient assessment skills', icon: '🔍' },
  { id: 'sub-safety-fund', categoryId: 'cat-fundamentals', name: 'Patient Safety', description: 'Safety and infection control', icon: '🛡️' },

  // Clinical Medicine
  { id: 'sub-cardio', categoryId: 'cat-clinical-medicine', name: 'Cardiovascular', description: 'Heart disorders', icon: '❤️' },
  { id: 'sub-respiratory', categoryId: 'cat-clinical-medicine', name: 'Respiratory', description: 'Lung disorders', icon: '🫁' },
  { id: 'sub-neuro', categoryId: 'cat-clinical-medicine', name: 'Neurology', description: 'Brain disorders', icon: '🧠' },

  // NCLEX
  { id: 'sub-nclex-fundamentals', categoryId: 'cat-nclex', name: 'NCLEX Fundamentals', description: 'Core NCLEX topics', icon: '📖' },
  { id: 'sub-pharmacology', categoryId: 'cat-nclex', name: 'Pharmacology', description: 'Medication topics', icon: '💊' },

  // NMCN
  { id: 'sub-nmcn-fundamentals', categoryId: 'cat-nmcn', name: 'NMCN Fundamentals', description: 'Core NMCN topics', icon: '📚' },
  { id: 'sub-midwifery', categoryId: 'cat-nmcn', name: 'Midwifery', description: 'Maternal care', icon: '🤰' },
];

// ============================================
// TOPICS (Linked to Sub-Categories)
// ============================================

export const topics: Topic[] = [
  // Basic Nursing Care
  { id: 'topic-vital-signs', subCategoryId: 'sub-basic-care', name: 'Vital Signs', description: 'Temperature, pulse, respiration, BP', questionCount: 20 },
  { id: 'topic-hygiene', subCategoryId: 'sub-basic-care', name: 'Patient Hygiene', description: 'Bathing and hygiene care', questionCount: 15 },
  { id: 'topic-mobility', subCategoryId: 'sub-basic-care', name: 'Mobility & Positioning', description: 'Patient positioning', questionCount: 12 },

  // Health Assessment
  { id: 'topic-physical-exam', subCategoryId: 'sub-assessment', name: 'Physical Examination', description: 'Systematic assessment', questionCount: 18 },

  // Patient Safety
  { id: 'topic-infection-control', subCategoryId: 'sub-safety-fund', name: 'Infection Control', description: 'Standard precautions', questionCount: 16 },

  // Cardiovascular
  { id: 'topic-heart-failure', subCategoryId: 'sub-cardio', name: 'Heart Failure', description: 'HF management', questionCount: 25 },
  { id: 'topic-hypertension', subCategoryId: 'sub-cardio', name: 'Hypertension', description: 'HTN management', questionCount: 18 },

  // Respiratory
  { id: 'topic-asthma', subCategoryId: 'sub-respiratory', name: 'Asthma', description: 'Asthma care', questionCount: 18 },

  // Pharmacology
  { id: 'topic-drug-calc', subCategoryId: 'sub-pharmacology', name: 'Drug Calculations', description: 'Medication math', questionCount: 22 },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSubCategories(categoryId: string): SubCategory[] {
  return subCategories.filter(s => s.categoryId === categoryId);
}

export function getTopics(subCategoryId: string): Topic[] {
  return topics.filter(t => t.subCategoryId === subCategoryId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(c => c.id === categoryId);
}

export function getSubCategoryById(subCategoryId: string): SubCategory | undefined {
  return subCategories.find(s => s.id === subCategoryId);
}

export function getTopicById(topicId: string): Topic | undefined {
  return topics.find(t => t.id === topicId);
}
