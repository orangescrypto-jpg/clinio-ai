import { Category, SubCategory, Topic } from '../types';

// Only 3 main categories: Clinical Medicine, NCLEX, NMCN
export const categories: Category[] = [
  {
    id: 'cat-clinical-medicine',
    name: 'Clinical Medicine',
    icon: '🏥',
    description: 'Core clinical knowledge for all healthcare students',
    targetAudience: 'Nursing & Medical Students',
  },
  {
    id: 'cat-nclex',
    name: 'NCLEX',
    icon: '🩺',
    description: 'NCLEX-RN/PN examination preparation',
    targetAudience: 'Nursing Students (US/Canada)',
  },
  {
    id: 'cat-nmcn',
    name: 'NMCN',
    icon: '🇳🇬',
    description: 'Nursing and Midwifery Council of Nigeria exam preparation',
    targetAudience: 'Nursing Students (Nigeria)',
  },
];

export const subCategories: SubCategory[] = [
  // Clinical Medicine
  { id: 'sub-cardio', categoryId: 'cat-clinical-medicine', name: 'Cardiovascular', description: 'Heart and vascular disorders', icon: '❤️' },
  { id: 'sub-respiratory', categoryId: 'cat-clinical-medicine', name: 'Respiratory', description: 'Lung and respiratory disorders', icon: '🫁' },
  { id: 'sub-endocrine', categoryId: 'cat-clinical-medicine', name: 'Endocrine', description: 'Hormonal and metabolic disorders', icon: '🔬' },
  { id: 'sub-neuro', categoryId: 'cat-clinical-medicine', name: 'Neurology', description: 'Nervous system disorders', icon: '🧠' },
  { id: 'sub-gi', categoryId: 'cat-clinical-medicine', name: 'Gastrointestinal', description: 'Digestive system disorders', icon: '🫄' },
  { id: 'sub-renal', categoryId: 'cat-clinical-medicine', name: 'Renal/Urinary', description: 'Kidney and urinary disorders', icon: '🫘' },
  { id: 'sub-heme', categoryId: 'cat-clinical-medicine', name: 'Hematology', description: 'Blood disorders', icon: '🩸' },
  { id: 'sub-infectious', categoryId: 'cat-clinical-medicine', name: 'Infectious Diseases', description: 'Infections', icon: '🦠' },
  { id: 'sub-msk', categoryId: 'cat-clinical-medicine', name: 'Musculoskeletal', description: 'Bone and joint disorders', icon: '🦴' },

  // NCLEX
  { id: 'sub-nclex-fundamentals', categoryId: 'cat-nclex', name: 'Fundamentals of Nursing', description: 'Core nursing principles', icon: '📋' },
  { id: 'sub-medsurg', categoryId: 'cat-nclex', name: 'Medical-Surgical Nursing', description: 'Adult health nursing', icon: '💊' },
  { id: 'sub-maternal', categoryId: 'cat-nclex', name: 'Maternal & Newborn', description: 'Obstetric nursing', icon: '👶' },
  { id: 'sub-peds', categoryId: 'cat-nclex', name: 'Pediatric Nursing', description: 'Child health nursing', icon: '🧒' },
  { id: 'sub-mental', categoryId: 'cat-nclex', name: 'Mental Health Nursing', description: 'Psychiatric nursing', icon: '🧠' },
  { id: 'sub-pharm', categoryId: 'cat-nclex', name: 'Pharmacology', description: 'Medication administration', icon: '💉' },
  { id: 'sub-leadership', categoryId: 'cat-nclex', name: 'Leadership & Management', description: 'Nursing leadership', icon: '👥' },
  { id: 'sub-safety', categoryId: 'cat-nclex', name: 'Safety & Infection Control', description: 'Patient safety', icon: '🛡️' },

  // NMCN
  { id: 'sub-nmcn-fundamentals', categoryId: 'cat-nmcn', name: 'Nursing Fundamentals', description: 'Core nursing knowledge', icon: '📖' },
  { id: 'sub-community', categoryId: 'cat-nmcn', name: 'Community Health', description: 'Public health nursing', icon: '🏘️' },
  { id: 'sub-midwifery', categoryId: 'cat-nmcn', name: 'Midwifery', description: 'Maternal and newborn care', icon: '🤰' },
  { id: 'sub-ethics', categoryId: 'cat-nmcn', name: 'Nursing Ethics & Law', description: 'Professional ethics', icon: '⚖️' },
  { id: 'sub-public-health', categoryId: 'cat-nmcn', name: 'Public Health Nursing', description: 'Population health', icon: '🌍' },
  { id: 'sub-nmcn-medsurg', categoryId: 'cat-nmcn', name: 'Medical-Surgical Nursing', description: 'Adult health', icon: '🏨' },
  { id: 'sub-nmcn-pharm', categoryId: 'cat-nmcn', name: 'Pharmacology', description: 'Drug therapy', icon: '💊' },
];

export const topics: Topic[] = [
  // Cardiovascular
  { id: 'topic-heart-failure', subCategoryId: 'sub-cardio', name: 'Heart Failure', description: 'HF pathophysiology and management', questionCount: 25 },
  { id: 'topic-hypertension', subCategoryId: 'sub-cardio', name: 'Hypertension', description: 'HTN diagnosis and treatment', questionCount: 18 },
  { id: 'topic-mi-acs', subCategoryId: 'sub-cardio', name: 'MI & Acute Coronary Syndrome', description: 'ACS management', questionCount: 22 },

  // Respiratory
  { id: 'topic-asthma', subCategoryId: 'sub-respiratory', name: 'Asthma', description: 'Asthma management', questionCount: 18 },
  { id: 'topic-copd', subCategoryId: 'sub-respiratory', name: 'COPD', description: 'COPD care', questionCount: 15 },
  { id: 'topic-pneumonia', subCategoryId: 'sub-respiratory', name: 'Pneumonia', description: 'Respiratory infections', questionCount: 20 },

  // NCLEX Fundamentals
  { id: 'topic-vital-signs', subCategoryId: 'sub-nclex-fundamentals', name: 'Vital Signs', description: 'Assessment skills', questionCount: 20 },
  { id: 'topic-patient-safety', subCategoryId: 'sub-nclex-fundamentals', name: 'Patient Safety', description: 'Safety protocols', questionCount: 18 },

  // NMCN Fundamentals
  { id: 'topic-nursing-process', subCategoryId: 'sub-nmcn-fundamentals', name: 'Nursing Process', description: 'ADPIE framework', questionCount: 20 },
];

export function getSubCategories(categoryId: string): SubCategory[] {
  return subCategories.filter(s => s.categoryId === categoryId);
}

export function getTopics(subCategoryId: string): Topic[] {
  return topics.filter(t => t.subCategoryId === subCategoryId);
}
