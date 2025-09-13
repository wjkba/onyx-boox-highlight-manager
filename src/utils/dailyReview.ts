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
  const lastDailyReview = localStorage.getItem("lastDailyReview");
  const now = new Date();

  if (lastDailyReview) {
    const lastReviewDate = new Date(lastDailyReview);
    if (
      now.getFullYear() !== lastReviewDate.getFullYear() ||
      now.getMonth() !== lastReviewDate.getMonth() ||
      now.getDate() !== lastReviewDate.getDate()
    ) {
      localStorage.setItem("isReviewCompleted", "false");
      return false;
    }
  }

  const isReviewCompleted = localStorage.getItem("isReviewCompleted");
  return isReviewCompleted === "true";
}

export function getCurrentStreak() {
  const streakCount = localStorage.getItem("streakCount") || "0";
  const lastDailyReview = localStorage.getItem("lastDailyReview");

  if (!lastDailyReview) return 0;

  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const lastReviewDate = new Date(lastDailyReview);
  const lastReviewDay = new Date(lastReviewDate.setHours(0, 0, 0, 0));

  const daysDifference = Math.round(
    (today.getTime() - lastReviewDay.getTime()) / (24 * 60 * 60 * 1000)
  );

  if (daysDifference > 1) return 0;
  return parseInt(streakCount);
}

export function updateStreak() {
  const lastDailyReview = localStorage.getItem("lastDailyReview");
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));

  if (!lastDailyReview) {
    localStorage.setItem("streakCount", "1");
    return;
  }

  const lastReviewDate = new Date(lastDailyReview);
  const lastReviewDay = new Date(lastReviewDate.setHours(0, 0, 0, 0));
  const daysDifference = Math.round(
    (today.getTime() - lastReviewDay.getTime()) / (24 * 60 * 60 * 1000)
  );

  let newStreak = 1;
  if (daysDifference === 1) {
    newStreak = parseInt(localStorage.getItem("streakCount") || "0") + 1;
  } else if (daysDifference === 0) {
    newStreak = parseInt(localStorage.getItem("streakCount") || "1");
  }

  localStorage.setItem("streakCount", newStreak.toString());
}
