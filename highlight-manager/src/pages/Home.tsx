import AddHighlight from "@/components/AddHighlight";
import Button from "@/components/Button";
import ImportDatabase from "@/components/import/ImportDatabase";
import UploadBoox from "@/components/import/UploadBoox";
import { db } from "@/db";
import { Layout } from "@/Layout";
import { isDailyReviewCompleted } from "@/utils/dailyReview";
import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { ScrollRestoration } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const highlights = useLiveQuery(() =>
    db.highlights.orderBy("dateAdded").reverse().limit(3).toArray()
  );
  const [isReviewCompleted, setIsReviewCompleted] = useState(true);

  useEffect(() => {
    const isCompleted = isDailyReviewCompleted();
    setIsReviewCompleted(isCompleted);
  }, []);

  function DailyReview() {
    if (!isReviewCompleted) {
      return (
        <div>
          <h1 className="text-xl font-medium">Daily review</h1>
          <p className="mb-4">Daily review is available</p>
          <Button
            className="w-full p-2 lg:max-w-[276px]"
            text="Open Daily Review"
            onClick={() => navigate("/review")}
          />
        </div>
      );
    } else return;
  }

  if (highlights && highlights.length > 0)
    return (
      <>
        <Layout>
          <section id="newest-highlights" className="mb-8">
            {highlights && highlights.length > 0 && (
              <div>
                <h1 className="text-xl font-medium mb-2">Newest Highlights</h1>
                <div className="grid xs:grid-cols-3 gap-2">
                  {highlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      onClick={() => navigate(`/highlight/${highlight.id}`)}
                      className="max-h-[10rem] lg:max-h-[12rem] text-xs lg:text-base w-full overflow-hidden dark:border-stone-500 border-stone-400 border-solid border p-2 hover-trigger"
                    >
                      {highlight.quote}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section id="daily-review" className="mb-8">
            <DailyReview />
          </section>

          <section className="mb-8" id="all-highlights">
            <h1 className="text-xl font-medium mb-2">All Highlights</h1>
            <Button
              className="w-full lg:max-w-[276px] p-2"
              text="View All Highlights"
              onClick={() => navigate("/all")}
            />
          </section>

          <section id="add-highlight">
            <h1 className="text-xl mb-2 font-medium">Add New Highlight</h1>
            <AddHighlight />
          </section>
        </Layout>
        <ScrollRestoration />
      </>
    );

  return (
    <Layout>
      <div className="lg:max-w-[450px]">
        <h1 className="mb-6 text-2xl font-medium">
          Import your highlights to get started
        </h1>
        <div className="mb-8">
          <UploadBoox />
        </div>
        <ImportDatabase />
      </div>
    </Layout>
  );
}
