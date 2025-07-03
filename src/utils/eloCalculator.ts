
interface EloCalculation {
  newRatingWinner: number;
  newRatingLoser: number;
  ratingChange: number;
}

export const calculateEloChange = (
  winnerRating: number,
  loserRating: number,
  kFactor: number = 32
): EloCalculation => {
  // Expected scores
  const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));
  
  // Actual scores (1 for win, 0 for loss)
  const actualWinner = 1;
  const actualLoser = 0;
  
  // New ratings
  const newRatingWinner = Math.round(winnerRating + kFactor * (actualWinner - expectedWinner));
  const newRatingLoser = Math.round(loserRating + kFactor * (actualLoser - expectedLoser));
  
  // Rating change
  const ratingChange = Math.abs(newRatingWinner - winnerRating);
  
  return {
    newRatingWinner,
    newRatingLoser,
    ratingChange
  };
};

export const getKFactor = (rating: number, gamesPlayed: number): number => {
  // Adjust K-factor based on rating and experience
  if (gamesPlayed < 10) return 40; // New players
  if (rating < 1200) return 32; // Lower rated players
  if (rating > 2000) return 16; // Higher rated players
  return 24; // Default
};

export const calculateXPGain = (
  isWinner: boolean,
  opponentRating: number,
  playerRating: number,
  debateLength: number
): number => {
  let baseXP = isWinner ? 50 : 25;
  
  // Bonus for beating higher-rated opponent
  if (isWinner && opponentRating > playerRating) {
    const ratingDiff = opponentRating - playerRating;
    baseXP += Math.floor(ratingDiff / 100) * 10;
  }
  
  // Bonus for longer debates (more engagement)
  const lengthBonus = Math.floor(debateLength / 10) * 5;
  
  return Math.min(baseXP + lengthBonus, 100); // Cap at 100 XP
};
