import { db } from "@/db";

export async function getDailyReviewQuotes() {
  const reviewDelay: number = getReviewDelay();
  const cardsPerReview: number = getCardsPerReview();
  const highlights = await db.highlights.toArray();
  const localExcludedBooks = localStorage.getItem("excludedBooks");
  const excludedBooks = localExcludedBooks
    ? JSON.parse(localExcludedBooks)
    : [];
  const dailyReviewable = highlights.filter((highlight) => {
    if (excludedBooks.includes(highlight.bookId)) return false;
    if (highlight.lastReviewed === null) {
      return true;
    } else {
      const lastReviewedDate = new Date(highlight.lastReviewed);
      const delayDate = new Date();
      delayDate.setDate(delayDate.getDate() - reviewDelay);
      return lastReviewedDate < delayDate;
    }
  });
  const shuffled = dailyReviewable.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, cardsPerReview);
}

function getReviewDelay() {
  const defaultDelay = 7;
  try {
    const reviewDelay = localStorage.getItem("reviewDelay");
    if (reviewDelay) {
      return Number(reviewDelay);
    }
    localStorage.setItem("reviewDelay", String(defaultDelay));
    return Number(reviewDelay);
  } catch (error) {
    console.log("Error getting reviews delay, setting to default.");
    localStorage.setItem("reviewDelay", String(defaultDelay));
    return defaultDelay;
  }
}

function getCardsPerReview() {
  const defaultCardsPerReview = 5;
  try {
    const cardsPerReview = localStorage.getItem("cardsPerReview");
    if (cardsPerReview) {
      return Number(cardsPerReview);
    }
    localStorage.setItem("cardsPerReview", String(defaultCardsPerReview));
    return Number(defaultCardsPerReview);
  } catch (error) {
    console.log("Error getting cards per review, setting to default.");
    localStorage.setItem("cardsPerReview", String(defaultCardsPerReview));
    return defaultCardsPerReview;
  }
}

export function isDailyReviewCompleted() {
  const lastReview = localStorage.getItem("lastDailyReview");
  if (lastReview) {
    const lastReviewDate = new Date(Date.parse(lastReview));
    const today = new Date();
    if (lastReviewDate.toDateString() === today.toDateString()) return true;
  }
  return false;
}
