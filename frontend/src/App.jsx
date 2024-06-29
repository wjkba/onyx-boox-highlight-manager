import "./App.css";
import Card from "./components/Card";
import data from "./data.json";

function App() {
  return (
    <div className="bg-pink-100 min-h-screen grid place-items-center">
      <div className="bg-slate-200 max-w-[450px] mx-3 text-sm">
        <div>
          {data.map((item, index) => (
            <Card
              key={index}
              quote={item.highlight}
              title={item.book_title}
              author={item.book_author}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
