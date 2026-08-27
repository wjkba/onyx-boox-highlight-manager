import { useEffect, useRef, useState } from "react";
import Switch from "@/components/ui/switch";
import ExcludeSettings from "../components/exclude-settings";

const MIN_REVIEW_DELAY = 0;
const MAX_REVIEW_DELAY = 365;
const DEFAULT_REVIEW_DELAY = 7;

const MIN_CARDS_PER_REVIEW = 1;
const MAX_CARDS_PER_REVIEW = 100;
const DEFAULT_CARDS_PER_REVIEW = 5;

type SaveStatus = "idle" | "pending" | "visible";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function SettingsPage() {
  const [reviewDelay, setReviewDelay] = useState<number | "">(
    DEFAULT_REVIEW_DELAY,
  );
  const [cardsPerReview, setCardsPerReview] = useState<number | "">(
    DEFAULT_CARDS_PER_REVIEW,
  );
  const [isReviewCompleted, setIsReviewCompleted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const storedReviewDelay = localStorage.getItem("reviewDelay");
      const storedCardsPerReview = localStorage.getItem("cardsPerReview");
      const storedIsReviewCompleted = localStorage.getItem("isReviewCompleted");

      if (storedReviewDelay) {
        const parsed = Number(storedReviewDelay);
        setReviewDelay(
          Number.isNaN(parsed)
            ? DEFAULT_REVIEW_DELAY
            : clamp(parsed, MIN_REVIEW_DELAY, MAX_REVIEW_DELAY),
        );
      }

      if (storedCardsPerReview) {
        const parsed = Number(storedCardsPerReview);
        setCardsPerReview(
          Number.isNaN(parsed)
            ? DEFAULT_CARDS_PER_REVIEW
            : clamp(parsed, MIN_CARDS_PER_REVIEW, MAX_CARDS_PER_REVIEW),
        );
      }

      if (storedIsReviewCompleted === "true") {
        setIsReviewCompleted(true);
      } else {
        localStorage.setItem("isReviewCompleted", "false");
        setIsReviewCompleted(false);
      }
    } catch {
      // localStorage may be disabled; fall back to defaults.
    }
  }, []);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const clearSaveTimer = () => {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
  };

  const showSavedAfterQuietPeriod = () => {
    clearSaveTimer();
    setSaveStatus("pending");
    saveTimerRef.current = window.setTimeout(() => {
      setSaveStatus("visible");
      saveTimerRef.current = window.setTimeout(() => {
        setSaveStatus("idle");
        saveTimerRef.current = null;
      }, 2000);
    }, 500);
  };

  const persistSettings = (updates: {
    reviewDelay?: number;
    cardsPerReview?: number;
    isReviewCompleted?: boolean;
  }) => {
    try {
      if (updates.reviewDelay !== undefined) {
        localStorage.setItem("reviewDelay", String(updates.reviewDelay));
      }
      if (updates.cardsPerReview !== undefined) {
        localStorage.setItem("cardsPerReview", String(updates.cardsPerReview));
      }
      if (updates.isReviewCompleted !== undefined) {
        localStorage.setItem(
          "isReviewCompleted",
          String(updates.isReviewCompleted),
        );
      }
      showSavedAfterQuietPeriod();
    } catch {
      // Fail silently if localStorage is disabled.
    }
  };

  const handleReviewDelayChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = event.target.value;

    if (raw === "") {
      setReviewDelay("");
      return;
    }

    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;

    const clamped = clamp(
      Math.round(parsed),
      MIN_REVIEW_DELAY,
      MAX_REVIEW_DELAY,
    );
    setReviewDelay(clamped);
    persistSettings({ reviewDelay: clamped });
  };

  const handleReviewDelayBlur = () => {
    if (reviewDelay === "") {
      setReviewDelay(DEFAULT_REVIEW_DELAY);
      persistSettings({ reviewDelay: DEFAULT_REVIEW_DELAY });
    }
  };

  const handleCardsPerReviewChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const raw = event.target.value;

    if (raw === "") {
      setCardsPerReview("");
      return;
    }

    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;

    const clamped = clamp(
      Math.round(parsed),
      MIN_CARDS_PER_REVIEW,
      MAX_CARDS_PER_REVIEW,
    );
    setCardsPerReview(clamped);
    persistSettings({ cardsPerReview: clamped });
  };

  const handleCardsPerReviewBlur = () => {
    if (cardsPerReview === "") {
      setCardsPerReview(DEFAULT_CARDS_PER_REVIEW);
      persistSettings({ cardsPerReview: DEFAULT_CARDS_PER_REVIEW });
    }
  };

  const handleReviewStatusChange = (checked: boolean) => {
    setIsReviewCompleted(checked);
    persistSettings({ isReviewCompleted: checked });
  };

  const inputClasses =
    "min-h-11 w-24 px-3 py-2 text-lg border border-neutral-900 bg-white text-neutral-900 " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 " +
    "dark:border-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:focus-visible:outline-neutral-100";

  const helperClasses =
    "text-sm text-neutral-700 dark:text-neutral-300 lg:pt-2.5";

  return (
    <div className="mb-6">
      <div className="lg:max-w-[450px]">
        <section className="mb-6">
          <h1 className="text-lg mb-2">Exclude books from daily review</h1>
          <ExcludeSettings />
        </section>

        <section className="mb-4">
          <label htmlFor="reviewDelay" className="text-lg mb-2 block">
            Review delay
          </label>
          <div className="lg:flex gap-4 items-start">
            <input
              id="reviewDelay"
              type="number"
              min={MIN_REVIEW_DELAY}
              max={MAX_REVIEW_DELAY}
              step={1}
              value={reviewDelay}
              onChange={handleReviewDelayChange}
              onBlur={handleReviewDelayBlur}
              className={inputClasses}
              aria-describedby="reviewDelay-description"
            />
            <span id="reviewDelay-description" className={helperClasses}>
              Number of days highlights must wait before being included in the
              daily review (default: {DEFAULT_REVIEW_DELAY})
            </span>
          </div>
        </section>

        <section className="mb-4">
          <label htmlFor="cardsPerReview" className="text-lg mb-2 block">
            Cards per review
          </label>
          <div className="lg:flex gap-4 items-start">
            <input
              id="cardsPerReview"
              type="number"
              min={MIN_CARDS_PER_REVIEW}
              max={MAX_CARDS_PER_REVIEW}
              step={1}
              value={cardsPerReview}
              onChange={handleCardsPerReviewChange}
              onBlur={handleCardsPerReviewBlur}
              className={inputClasses}
              aria-describedby="cardsPerReview-description"
            />
            <span id="cardsPerReview-description" className={helperClasses}>
              Specify the maximum number of cards to be shown in each daily
              review session (default: {DEFAULT_CARDS_PER_REVIEW})
            </span>
          </div>
        </section>

        <section className="mb-6">
          <label htmlFor="reviewStatus" className="text-lg mb-2 block">
            Review status
          </label>
          <div className="lg:flex gap-4 items-start">
            <Switch
              id="reviewStatus"
              checked={isReviewCompleted}
              onCheckedChange={handleReviewStatusChange}
              aria-describedby="reviewStatus-description"
            />
            <span id="reviewStatus-description" className={helperClasses}>
              Toggle to mark whether you have completed today&apos;s daily
              review.
            </span>
          </div>
        </section>

        <div
          className="min-h-6"
          aria-live="polite"
          aria-atomic="true"
        >
          {saveStatus === "visible" && (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
