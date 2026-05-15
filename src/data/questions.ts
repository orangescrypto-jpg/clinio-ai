import { Question } from '../types';

const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

function mapDocToQuestion(doc: any): Question {
  const f = doc.fields;
  return {
    id: doc.name.split('/').pop() as string,
    topicId: f.topicId?.stringValue || '',
    stem: f.stem?.stringValue || '',
    choices: f.choices?.arrayValue?.values?.map((v: any) => ({
      id: v.mapValue?.fields?.id?.stringValue || '',
      text: v.mapValue?.fields?.text?.stringValue || '',
    })) || [],
    correctAnswerId: f.correctAnswerId?.stringValue || '',
    explanation: f.explanation?.stringValue || '',
    difficulty: (f.difficulty?.stringValue as Question['difficulty']) || 'medium',
  };
}

/** Fetch all questions from Firestore (full collection). */
async function fetchAllQuestions(): Promise<Question[]> {
  const response = await fetch(`${FIRESTORE_URL}/questions`);
  if (!response.ok) throw new Error(`Failed to fetch questions: ${response.status}`);
  const data = await response.json();
  if (!data.documents) return [];
  return data.documents.map(mapDocToQuestion);
}

/** Returns questions matching a specific topicId. */
export async function fetchQuestionsByTopic(topicId: string): Promise<Question[]> {
  const all = await fetchAllQuestions();
  return all.filter((q) => q.topicId === topicId);
}

/**
 * Returns questions matching a list of topicIds.
 * Used for "By SubCategory" and "By Category" quiz/exam scopes.
 */
export async function fetchQuestionsByTopics(topicIds: string[]): Promise<Question[]> {
  if (topicIds.length === 0) return [];
  const set = new Set(topicIds);
  const all = await fetchAllQuestions();
  return all.filter((q) => set.has(q.topicId));
}

/** Returns ALL questions (for "Mixed" scope). */
export async function fetchAllQuestionsForQuiz(): Promise<Question[]> {
  return fetchAllQuestions();
}
