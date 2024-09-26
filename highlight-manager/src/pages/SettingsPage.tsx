import Button from "@/components/Button";
import { Layout } from "../Layout";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [newReviewDelay, setNewReviewDelay] = useState(7);
  const [newCardsPerReview, setNewCardsPerPreview] = useState(5);
  const [isSaved, setIsSaved] = useState(false);
  const [isReviewCompleted, setIsReviewCompleted] = useState(false);

  useEffect(() => {
    const reviewDelay = localStorage.getItem("reviewDelay");
    const cardsPerReview = localStorage.getItem("cardsPerReview");
    try {
      if (reviewDelay) {
        setNewReviewDelay(Number(reviewDelay));
      }
      if (cardsPerReview) {
        setNewCardsPerPreview(Number(cardsPerReview));
      }
    } catch (error) {
      console.log("error getting settings, set to defaullt");
      setNewReviewDelay(7);
      setNewCardsPerPreview(5);
    }
  }, []);

  useEffect(() => {
    const lastReview = localStorage.getItem("lastDailyReview");
    if (lastReview) {
      const lastReviewDate = new Date(Date.parse(lastReview));
      const now = new Date();
      if (
        lastReviewDate.getFullYear() === now.getFullYear() &&
        lastReviewDate.getMonth() === now.getMonth() &&
        lastReviewDate.getDate() === now.getDate()
      ) {
        setIsReviewCompleted(true);
      }
    } else {
      setIsReviewCompleted(false);
    }
  }, []);

  // function handleDatabaseDelete() {
  //   clearDatabaseTable();
  // }

  function handleReviewDelayChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if (value < 0) {
      setNewReviewDelay(0);
    } else setNewReviewDelay(value);
  }
  function handleCardsPerReviewChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = Number(event.target.value);
    if (value < 0) {
      setNewCardsPerPreview(0);
    } else setNewCardsPerPreview(value);
  }
  function handleReviewStatusChange() {
    setIsReviewCompleted(!isReviewCompleted);
  }

  async function handleSaveReviewSettings() {
    try {
      if (!isReviewCompleted) {
        localStorage.removeItem("lastDailyReview");
      } else {
        const now = new Date();
        localStorage.setItem("lastDailyReview", now.toISOString());
      }
      localStorage.setItem("reviewDelay", String(newReviewDelay));
      localStorage.setItem("cardsPerReview", String(newCardsPerReview));
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      setIsSaved(false);
      console.log("error saving settings");
    }
  }

  return (
    <Layout>
      <h1 className="text-xl mb-4">Settings</h1>
      <div className="mb-6">
        <section id="reviewSettings" className="mb-8">
          <h2 className="text-lg mb-2">Review settings</h2>
          <div className="lg:max-w-[420px]">
            <h3 className="mb-1 fo">Review delay</h3>
            <div className="lg:flex gap-4 items-center mb-4">
              <input
                className="py-2 px-2 w-full lg:max-w-[4rem] border text-lg border-black dark:border-white dark:bg-neutral-900"
                type="number"
                id="reviewDelay"
                placeholder="7"
                value={newReviewDelay}
                onChange={handleReviewDelayChange}
              />
              <span>
                Number of days highlights must wait before being included in the
                daily review (default: 7)
              </span>
            </div>
            <h3 className="mb-1">Cards per review</h3>
            <div className="lg:flex gap-4 items-center mb-4">
              <input
                className="py-2 px-2 w-full lg:max-w-[4rem] border text-lg border-black dark:border-white dark:bg-neutral-900"
                type="number"
                id="cardsPerReview"
                placeholder="5"
                value={newCardsPerReview}
                onChange={handleCardsPerReviewChange}
              />
              <span>
                Specify the maximum number of cards to be shown in each daily
                review session (default: 5)
              </span>
            </div>
            <h3 className="mb-1">Review status</h3>
            <div className="lg:flex gap-4 items-center mb-6">
              <div className="py-2 px-2 w-full lg:max-w-[4rem] border text-lg border-black dark:border-white dark:bg-neutral-900">
                <input
                  className="min-w-[2rem] w-full border text-lg border-black dark:bg-white dark:text-black"
                  type="checkbox"
                  id="reviewStatus"
                  checked={isReviewCompleted}
                  onChange={handleReviewStatusChange}
                />
              </div>
              <span>
                Toggle to mark whether you have completed today's daily review.
              </span>
            </div>
            <Button
              text={isSaved ? "Saved" : "Save"}
              type="button"
              onClick={handleSaveReviewSettings}
              className="p-2 w-full"
            />
          </div>
        </section>
      </div>
      {/* <div>
        <h2 className="text-lg mb-2">Danger zone</h2>
        <div>
          <DangerButton action={handleDatabaseDelete} />
        </div>
      </div> */}
    </Layout>
  );
}
