const FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

export async function fetchQuestionsByTopic(topicId: string): Promise<any[]> {
  try {
    const response = await fetch(`${FIRESTORE_URL}/questions`);
    const data = await response.json();
    if (data.documents) {
      const questions = data.documents
        .map((doc: any) => {
          const f = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            topicId: f.topicId?.stringValue || '',
            stem: f.stem?.stringValue || '',
            choices: f.choices?.arrayValue?.values?.map((v: any) => ({
              id: v.mapValue?.fields?.id?.stringValue || '',
              text: v.mapValue?.fields?.text?.stringValue || '',
            })) || [],
            correctAnswerId: f.correctAnswerId?.stringValue || '',
            explanation: f.explanation?.stringValue || '',
            difficulty: f.difficulty?.stringValue || 'medium',
            tags: f.tags?.arrayValue?.values?.map((v: any) => v.stringValue) || [],
          };
        })
        .filter((q: any) => q.topicId === topicId);
      return questions;
    }
  } catch (err) {
    console.error('Failed to fetch questions:', err);
  }
  return [];
}
