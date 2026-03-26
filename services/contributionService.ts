export interface Contribution {
  id: string;
  experimentId: string;
  userId: string;
  username: string;
  content: string;
  fileUrl?: string;
  type: 'note' | 'solution' | 'code' | 'diagram' | 'comment';
  upvotes: number;
  createdAt: string;
}

export const addContribution = async (contribution: Omit<Contribution, 'id' | 'upvotes' | 'createdAt'>) => {
  const newId = Math.random().toString(36).substring(2, 15);
  const response = await fetch('/api/contributions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...contribution, id: newId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to add contribution');
  }
  
  return await response.json();
};

export const getContributionsByExperiment = async (experimentId: string): Promise<Contribution[]> => {
  try {
    const response = await fetch(`/api/contributions/${experimentId}`);
    if (!response.ok) throw new Error('Failed to fetch contributions');
    return await response.json();
  } catch (error: any) {
    console.warn("Could not fetch contributions from API:", error);
    return [];
  }
};

export const upvoteContribution = async (contributionId: string, userId: string, authorId: string) => {
  const response = await fetch(`/api/contributions/${contributionId}/upvote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, authorId })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upvote');
  }
};

export const deleteContribution = async (contributionId: string) => {
  const response = await fetch(`/api/contributions/${contributionId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete contribution');
  }
};

export const updateContribution = async (contributionId: string, content: string, type: 'note' | 'solution' | 'code' | 'diagram' | 'comment') => {
  const response = await fetch(`/api/contributions/${contributionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, type })
  });
  
  if (!response.ok) {
    throw new Error('Failed to update contribution');
  }
};
