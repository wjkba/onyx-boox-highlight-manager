import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <div className="grid place-items-center ">
      <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
        <Navbar />
        <main className="min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
          <div className="lg:w-full">
            <p>This is a work in progress onyx boox highlights manager app</p>
          </div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
}
