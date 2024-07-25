import Navbar from "@/components/Navbar";

export default function HelpPage() {
  return (
    <div className="grid place-items-center ">
      <div className=" w-full max-w-[600px] lg:max-w-[1200px] px-4">
        <Navbar />
        <main className="bg-white min-h-screen lg:flex lg:gap-[32px] lg:pt-8">
          <div className="lg:w-full">
            <h1 className="text-xl font-medium mb-2">
              How to export onyx boox annotations
            </h1>
            <div className="pl-4 max-w-[600px]">
              <ol className="list-decimal">
                <li>
                  Open the Book: Start by opening the book or document from
                  which you want to export annotations.
                </li>
                <li>
                  Access the Table of Contents (TOC): Tap on the screen to bring
                  up the menu options. Navigate to the Table of Contents (TOC)
                  and tap on it to view the book's sections and features.
                </li>
                <li>
                  Go to Annotations: In the TOC menu, locate and select the
                  "Annotations" option to display all annotations you’ve made in
                  the document.
                </li>
                <li>
                  Select All Annotations: Once you’re in the Annotations
                  section, tap on "Select All" to highlight all of your
                  annotations.
                </li>
                <li>
                  Export Annotations: After selecting all annotations, choose
                  the "Export" option. This will save your annotations as a TXT
                  file.
                </li>
                <li>
                  Import the TXT File: You now have a TXT file containing your
                  annotations, which you can import here for further use.
                </li>
              </ol>
            </div>
          </div>
        </main>
        <footer></footer>
      </div>
    </div>
  );
}
