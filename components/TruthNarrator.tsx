import React from "react";


const sampleQuote = `"The truth does not mind being questioned. A lie does."`;

function TruthNarrator() {
  return (
    <div className="p-6 space-y-4 text-center">
      <h2 className="text-xl font-semibold">🧠 Quote of the Moment</h2>
      <p className="text-lg italic text-gray-700">{sampleQuote}</p>
    </div>
  );
}

export default TruthNarrator;
