import { UserProfile } from './authService';

export const getLeaderboard = async (): Promise<UserProfile[]> => {
  try {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return await response.json();
  } catch (error: any) {
    console.warn("Could not fetch leaderboard from API:", error);
    return [];
  }
};
