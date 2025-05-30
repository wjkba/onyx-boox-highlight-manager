import Button from "@/components/Button";
import { Layout } from "../Layout";
import { useEffect, useState } from "react";
import ExcludeSettings from "@/components/settings/ExcludeSettings";

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
    const isReviewCompleted = localStorage.getItem("isReviewCompleted");
    if (isReviewCompleted === "true") setIsReviewCompleted(true);
    else {
      localStorage.setItem("isReviewCompleted", "false");
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
      if (!isReviewCompleted)
        localStorage.setItem("isReviewCompleted", "false");
      else localStorage.setItem("isReviewCompleted", "true");
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
      <div className="mb-6">
        <div className="lg:max-w-[450px]">
          <section className="mb-6">
            <h1 className="text-lg mb-2">Exclude books from daily review</h1>
            <ExcludeSettings />
          </section>

          <section className="mb-4">
            <h1 className="text-lg mb-2">Review delay</h1>
            <div className="lg:flex gap-4 items-start">
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
          </section>

          <section className="mb-4">
            <h1 className="text-lg mb-2">Cards per review</h1>
            <div className="lg:flex gap-4 items-start">
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
          </section>

          <section className="mb-6">
            <h1 className="text-lg mb-2">Review status</h1>
            <div className="lg:flex gap-4 items-start">
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
          </section>

          <Button
            text={isSaved ? "Saved" : "Save"}
            type="button"
            onClick={handleSaveReviewSettings}
            className="p-2 mb-8 w-full"
          />
        </div>
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
