import { BookEntry } from "@/types/types";

export async function getDailyReviewQuotes(books: BookEntry[]) {
  const allQuotes = await getAllQuotes(books);
  const dailyReviewable = allQuotes?.filter((quote) => {
    if (quote.lastReviewed === null) {
      return true;
    }
    const lastReviewedDate = new Date(quote.lastReviewed);
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    return lastReviewedDate >= fiveDaysAgo;
  });
  const shuffled = dailyReviewable?.sort(() => 0.5 - Math.random());
  return shuffled?.slice(0, 5);
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

export async function testing() {}
