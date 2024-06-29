import PropTypes from "prop-types";
export default function Card({ quote, author, title }) {
  return (
    <div className="max-w-[400px] drop-shadow bg-white p-4 rounded mb-2">
      {/* <div className="flex gap-2 mb-2 bg-gray-200">
        <img src="https://placehold.co/45x60" alt="" />
        <div>
          <h1 className="text-base">{title}</h1>
          <p>{author}</p>
        </div>
      </div> */}
      <div className="bg-gray-200 mb-2">
        <span>{title}</span>
        <span> - </span>
        <span>{author}</span>
      </div>
      <p>{quote}</p>
    </div>
  );
}

Card.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
