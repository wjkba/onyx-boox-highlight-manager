import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
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
  const [error, setError] = useState<string | null>(null);
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

      setError(null);
    } catch {
      setError("Settings couldn't be loaded");
    }

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
      setError(null);
      showSavedAfterQuietPeriod();
    } catch {
      setError("Couldn't save settings");
    }
  };

  const updateNumberSetting = (
    value: string | number | "",
    min: number,
    max: number,
    _defaultValue: number,
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    persist: (value: number) => void,
  ) => {
    if (value === "") {
      setter("");
      return;
    }

    const numeric = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(numeric)) return;

    const clamped = clamp(Math.round(numeric), min, max);
    setter(clamped);
    persist(clamped);
  };

  const handleReviewStatusChange = (checked: boolean) => {
    setIsReviewCompleted(checked);
    persistSettings({ isReviewCompleted: checked });
  };

  const adjustReviewDelay = (delta: number) => {
    const current = reviewDelay === "" ? DEFAULT_REVIEW_DELAY : reviewDelay;
    updateNumberSetting(
      current + delta,
      MIN_REVIEW_DELAY,
      MAX_REVIEW_DELAY,
      DEFAULT_REVIEW_DELAY,
      setReviewDelay,
      (value) => persistSettings({ reviewDelay: value }),
    );
  };

  const adjustCardsPerReview = (delta: number) => {
    const current =
      cardsPerReview === "" ? DEFAULT_CARDS_PER_REVIEW : cardsPerReview;
    updateNumberSetting(
      current + delta,
      MIN_CARDS_PER_REVIEW,
      MAX_CARDS_PER_REVIEW,
      DEFAULT_CARDS_PER_REVIEW,
      setCardsPerReview,
      (value) => persistSettings({ cardsPerReview: value }),
    );
  };

  const inputClasses =
    "min-h-11 w-24 px-3 py-2 text-lg border border-neutral-900 bg-white text-neutral-900 " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 " +
    "dark:border-neutral-100 dark:bg-neutral-900 dark:text-neutral-100 dark:focus-visible:outline-neutral-100 " +
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const helperClasses =
    "text-sm text-neutral-700 dark:text-neutral-300 lg:pt-2.5";

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-6 lg:max-w-[450px]">
        <h1 className="text-2xl font-bold">Settings</h1>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 block w-full text-lg">
            Exclude books from daily review
          </legend>
          <section>
            <ExcludeSettings />
          </section>
        </fieldset>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 block w-full text-lg">Review delay</legend>
          <div className="flex flex-col items-start gap-2 lg:flex-row lg:gap-4">
            <label htmlFor="reviewDelay" className="sr-only">
              Review delay
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="px-4 text-lg"
                type="button"
                aria-label="Decrease review delay"
                onClick={() => adjustReviewDelay(-1)}
              >
                −
              </Button>
              <input
                id="reviewDelay"
                type="number"
                min={MIN_REVIEW_DELAY}
                max={MAX_REVIEW_DELAY}
                step={1}
                value={reviewDelay}
                onChange={(event) =>
                  updateNumberSetting(
                    event.target.value,
                    MIN_REVIEW_DELAY,
                    MAX_REVIEW_DELAY,
                    DEFAULT_REVIEW_DELAY,
                    setReviewDelay,
                    (value) => persistSettings({ reviewDelay: value }),
                  )
                }
                onBlur={() => {
                  if (reviewDelay === "") {
                    updateNumberSetting(
                      DEFAULT_REVIEW_DELAY,
                      MIN_REVIEW_DELAY,
                      MAX_REVIEW_DELAY,
                      DEFAULT_REVIEW_DELAY,
                      setReviewDelay,
                      (value) => persistSettings({ reviewDelay: value }),
                    );
                  }
                }}
                className={inputClasses}
                aria-describedby="reviewDelay-description"
              />
              <Button
                variant="secondary"
                className="px-4 text-lg"
                type="button"
                aria-label="Increase review delay"
                onClick={() => adjustReviewDelay(1)}
              >
                +
              </Button>
            </div>
            <span id="reviewDelay-description" className={helperClasses}>
              Number of days highlights must wait before being included in the
              daily review (default: {DEFAULT_REVIEW_DELAY})
            </span>
          </div>
        </fieldset>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 block w-full text-lg">
            Cards per review
          </legend>
          <div className="flex flex-col items-start gap-2 lg:flex-row lg:gap-4">
            <label htmlFor="cardsPerReview" className="sr-only">
              Cards per review
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="px-4 text-lg"
                type="button"
                aria-label="Decrease cards per review"
                onClick={() => adjustCardsPerReview(-1)}
              >
                −
              </Button>
              <input
                id="cardsPerReview"
                type="number"
                min={MIN_CARDS_PER_REVIEW}
                max={MAX_CARDS_PER_REVIEW}
                step={1}
                value={cardsPerReview}
                onChange={(event) =>
                  updateNumberSetting(
                    event.target.value,
                    MIN_CARDS_PER_REVIEW,
                    MAX_CARDS_PER_REVIEW,
                    DEFAULT_CARDS_PER_REVIEW,
                    setCardsPerReview,
                    (value) => persistSettings({ cardsPerReview: value }),
                  )
                }
                onBlur={() => {
                  if (cardsPerReview === "") {
                    updateNumberSetting(
                      DEFAULT_CARDS_PER_REVIEW,
                      MIN_CARDS_PER_REVIEW,
                      MAX_CARDS_PER_REVIEW,
                      DEFAULT_CARDS_PER_REVIEW,
                      setCardsPerReview,
                      (value) => persistSettings({ cardsPerReview: value }),
                    );
                  }
                }}
                className={inputClasses}
                aria-describedby="cardsPerReview-description"
              />
              <Button
                variant="secondary"
                className="px-4 text-lg"
                type="button"
                aria-label="Increase cards per review"
                onClick={() => adjustCardsPerReview(1)}
              >
                +
              </Button>
            </div>
            <span id="cardsPerReview-description" className={helperClasses}>
              Specify the maximum number of cards to be shown in each daily
              review session (default: {DEFAULT_CARDS_PER_REVIEW})
            </span>
          </div>
        </fieldset>

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 block w-full text-lg">
            Mark today&apos;s review as complete
          </legend>
          <div className="flex flex-col items-start gap-2 lg:flex-row lg:gap-4">
            <label htmlFor="reviewStatus" className="sr-only">
              Mark today&apos;s review as complete
            </label>
            <Switch
              id="reviewStatus"
              checked={isReviewCompleted}
              onCheckedChange={handleReviewStatusChange}
              aria-describedby="reviewStatus-description"
            />
            <span id="reviewStatus-description" className={helperClasses}>
              Skip today&apos;s review session. You can undo this at any time.
            </span>
          </div>
        </fieldset>

        <div
          className="min-h-6"
          aria-live="polite"
          aria-atomic="true"
        >
          {error && (
            <output
              aria-live="polite"
              className="text-sm text-red-500 dark:text-red-400"
            >
              {error}
            </output>
          )}
          {!error && saveStatus === "visible" && (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
