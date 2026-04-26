const FIREBASE_URL = 'https://firestore.googleapis.com/v1/projects/clinio-ai/databases/(default)/documents';

export async function fetchCategories(): Promise<any[]> {
  try {
    const response = await fetch(`${FIREBASE_URL}/categories`);
    const data = await response.json();
    if (data.documents) {
      return data.documents.map((doc: any) => {
        const f = doc.fields;
        return {
          id: doc.name.split('/').pop(),
          name: f.name?.stringValue || '',
          icon: f.icon?.stringValue || '',
          description: f.description?.stringValue || '',
          targetAudience: f.targetAudience?.stringValue || '',
        };
      });
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
  return [];
}

export async function fetchSubCategories(categoryId?: string): Promise<any[]> {
  try {
    const response = await fetch(`${FIREBASE_URL}/subCategories`);
    const data = await response.json();
    if (data.documents) {
      let results = data.documents.map((doc: any) => {
        const f = doc.fields;
        return {
          id: doc.name.split('/').pop(),
          categoryId: f.categoryId?.stringValue || '',
          name: f.name?.stringValue || '',
          description: f.description?.stringValue || '',
          icon: f.icon?.stringValue || '',
        };
      });
      if (categoryId) {
        results = results.filter((s: any) => s.categoryId === categoryId);
      }
      return results;
    }
  } catch (err) {
    console.error('Failed to fetch subcategories:', err);
  }
  return [];
}

export async function fetchTopics(subCategoryId?: string): Promise<any[]> {
  try {
    const response = await fetch(`${FIREBASE_URL}/topics`);
    const data = await response.json();
    if (data.documents) {
      let results = data.documents.map((doc: any) => {
        const f = doc.fields;
        return {
          id: doc.name.split('/').pop(),
          subCategoryId: f.subCategoryId?.stringValue || '',
          name: f.name?.stringValue || '',
          description: f.description?.stringValue || '',
          questionCount: f.questionCount?.integerValue || 0,
        };
      });
      if (subCategoryId) {
        results = results.filter((t: any) => t.subCategoryId === subCategoryId);
      }
      return results;
    }
  } catch (err) {
    console.error('Failed to fetch topics:', err);
  }
  return [];
}
