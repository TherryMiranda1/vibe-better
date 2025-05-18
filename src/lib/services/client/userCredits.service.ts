export async function getUserCredits(): Promise<number> {
  try {
    const response = await fetch(`/api/users/credits`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user credits');
    }
    
    const data = await response.json();
    return data.credits;
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return 0;
  }
}
