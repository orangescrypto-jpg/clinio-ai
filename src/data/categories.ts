import { Category, SubCategory, Topic } from '../types';

export const categories: Category[] = [
  {
    id: 'clinical-medicine',
    name: 'Clinical Medicine',
    icon: '🏥',
    description: 'Core clinical knowledge',
    targetAudience: 'Nursing & Medical Students',
  },
  {
    id: 'nclex',
    name: 'NCLEX',
    icon: '🩺',
    description: 'NCLEX exam preparation',
    targetAudience: 'Nursing Students (US/Canada)',
  },
  {
    id: 'nmcn',
    name: 'NMCN',
    icon: '🇳🇬',
    description: 'NMCN exam preparation',
    targetAudience: 'Nursing Students (Nigeria)',
  },
];

export const subCategories: SubCategory[] = [
  // Clinical Medicine
  { id: 'cardio', categoryId: 'clinical-medicine', name: 'Cardiovascular', description: 'Heart disorders', icon: '❤️' },
  { id: 'respiratory', categoryId: 'clinical-medicine', name: 'Respiratory', description: 'Lung disorders', icon: '🫁' },
  { id: 'endocrine', categoryId: 'clinical-medicine', name: 'Endocrine', description: 'Hormone disorders', icon: '🔬' },
  { id: 'neuro', categoryId: 'clinical-medicine', name: 'Neurology', description: 'Brain disorders', icon: '🧠' },
  { id: 'gi', categoryId: 'clinical-medicine', name: 'Gastrointestinal', description: 'Digestive disorders', icon: '🫄' },
  { id: 'renal', categoryId: 'clinical-medicine', name: 'Renal/Urinary', description: 'Kidney disorders', icon: '🫘' },
  { id: 'heme', categoryId: 'clinical-medicine', name: 'Hematology', description: 'Blood disorders', icon: '🩸' },
  { id: 'infectious', categoryId: 'clinical-medicine', name: 'Infectious Diseases', description: 'Infections', icon: '🦠' },
  { id: 'msk', categoryId: 'clinical-medicine', name: 'Musculoskeletal', description: 'Bone disorders', icon: '🦴' },
  // NCLEX
  { id: 'fundamentals', categoryId: 'nclex', name: 'Fundamentals of Nursing', description: 'Core nursing', icon: '📋' },
  { id: 'medsurg', categoryId: 'nclex', name: 'Medical-Surgical Nursing', description: 'Adult nursing', icon: '💊' },
  { id: 'maternal', categoryId: 'nclex', name: 'Maternal & Newborn', description: 'OB nursing', icon: '👶' },
  { id: 'peds', categoryId: 'nclex', name: 'Pediatric Nursing', description: 'Child nursing', icon: '🧒' },
  { id: 'mental', categoryId: 'nclex', name: 'Mental Health Nursing', description: 'Psychiatric nursing', icon: '🧠' },
  { id: 'pharm', categoryId: 'nclex', name: 'Pharmacology', description: 'Medications', icon: '💉' },
  { id: 'leadership', categoryId: 'nclex', name: 'Leadership', description: 'Management', icon: '👥' },
  { id: 'safety', categoryId: 'nclex', name: 'Safety & Infection', description: 'Safety protocols', icon: '🛡️' },
  // NMCN
  { id: 'nmcn-fund', categoryId: 'nmcn', name: 'Nursing Fundamentals', description: 'Core nursing', icon: '📖' },
  { id: 'community', categoryId: 'nmcn', name: 'Community Health', description: 'Public health', icon: '🏘️' },
  { id: 'midwifery', categoryId: 'nmcn', name: 'Midwifery', description: 'Maternal care', icon: '🤰' },
  { id: 'ethics', categoryId: 'nmcn', name: 'Ethics & Law', description: 'Professional ethics', icon: '⚖️' },
  { id: 'public-health', categoryId: 'nmcn', name: 'Public Health', description: 'Population health', icon: '🌍' },
  { id: 'nmcn-medsurg', categoryId: 'nmcn', name: 'Medical-Surgical', description: 'Adult nursing', icon: '🏨' },
  { id: 'nmcn-pharm', categoryId: 'nmcn', name: 'Pharmacology', description: 'Medications', icon: '💊' },
];

export const topics: Topic[] = [
  { id: 'heart-failure', subCategoryId: 'cardio', name: 'Heart Failure', description: 'HF management', questionCount: 25 },
  { id: 'arrhythmias', subCategoryId: 'cardio', name: 'Arrhythmias', description: 'ECG interpretation', questionCount: 20 },
  { id: 'hypertension', subCategoryId: 'cardio', name: 'Hypertension', description: 'HTN management', questionCount: 18 },
  { id: 'mi-acs', subCategoryId: 'cardio', name: 'MI & ACS', description: 'Acute coronary syndrome', questionCount: 22 },
  { id: 'asthma', subCategoryId: 'respiratory', name: 'Asthma', description: 'Asthma care', questionCount: 18 },
  { id: 'copd', subCategoryId: 'respiratory', name: 'COPD', description: 'COPD management', questionCount: 15 },
  { id: 'pneumonia', subCategoryId: 'respiratory', name: 'Pneumonia', description: 'Respiratory infection', questionCount: 20 },
  { id: 'diabetes', subCategoryId: 'endocrine', name: 'Diabetes Mellitus', description: 'Diabetes care', questionCount: 24 },
  { id: 'thyroid', subCategoryId: 'endocrine', name: 'Thyroid Disorders', description: 'Thyroid conditions', questionCount: 16 },
  { id: 'stroke', subCategoryId: 'neuro', name: 'Stroke', description: 'CVA management', questionCount: 20 },
  { id: 'seizures', subCategoryId: 'neuro', name: 'Seizures', description: 'Epilepsy care', questionCount: 15 },
  { id: 'vital-signs', subCategoryId: 'fundamentals', name: 'Vital Signs', description: 'Assessment skills', questionCount: 20 },
  { id: 'patient-safety', subCategoryId: 'fundamentals', name: 'Patient Safety', description: 'Safety protocols', questionCount: 18 },
  { id: 'nursing-process', subCategoryId: 'nmcn-fund', name: 'Nursing Process', description: 'ADPIE framework', questionCount: 20 },
];

export function getSubCategories(categoryId: string): SubCategory[] {
  return subCategories.filter(s => s.categoryId === categoryId);
}

export function getTopics(subCategoryId: string): Topic[] {
  return topics.filter(t => t.subCategoryId === subCategoryId);
}
