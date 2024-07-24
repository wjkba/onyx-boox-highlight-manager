import Navbar from "@/components/Navbar";

export default function DailyReviewPage() {
  return (
    <div className="grid place-items-center ">
      <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
        <Navbar />
        <main className="bg-white min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
          <div className="lg:w-full">
            <h1>DailyReviewPage</h1>
          </div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
}
