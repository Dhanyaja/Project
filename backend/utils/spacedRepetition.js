export const updateCardAfterReview = (card, quality) => {
  // Minimum EF is 1.3 according to SM-2
  const MIN_EF = 1.3;

  if (quality < 3) {
    card.repetitions = 0;
    card.interval = 1;
  } else {
    card.repetitions += 1;
    if (card.repetitions === 1) {
      card.interval = 1;
    } else if (card.repetitions === 2) {
      card.interval = 6;
    } else {
      card.interval = Math.round(card.interval * card.easeFactor);
    }
  }

  // Update ease factor
  const newEF = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  card.easeFactor = Math.max(MIN_EF, newEF);

  // Update due date
  card.dueDate = new Date();
  card.dueDate.setDate(card.dueDate.getDate() + card.interval);

  card.lastReviewed = new Date();
  card.lastQuality = quality;
  card.isNew = false;

  return card;
};
