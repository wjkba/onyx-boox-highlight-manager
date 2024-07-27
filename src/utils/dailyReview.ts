import { BookEntry } from "@/types/types";

export async function getDailyReviewQuotes(books: BookEntry[]) {
  const reviewDelay: number = getReviewDelay();
  const cardsPerReview: number = getCardsPerReview();
  const allQuotes = await getAllQuotes(books);
  const dailyReviewable = allQuotes?.filter((quote) => {
    if (quote.lastReviewed === null) {
      return true;
    } else {
      const lastReviewedDate = new Date(quote.lastReviewed);
      const delayDate = new Date();
      delayDate.setDate(delayDate.getDate() - reviewDelay);
      return lastReviewedDate < delayDate;
    }
  });
  const shuffled = dailyReviewable?.sort(() => 0.5 - Math.random());
  return shuffled?.slice(0, cardsPerReview);
}

export async function getAllQuotes(books: BookEntry[]) {
  let allQuotes = books?.flatMap((book) =>
    book.quotes.map(({ id, ...quote }) => ({
      ...quote,
      bookAuthor: book.bookAuthor,
      bookTitle: book.bookTitle,
      id: `${book.id}/${id}`,
    }))
  );
  return allQuotes;
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

export async function testing() {}
