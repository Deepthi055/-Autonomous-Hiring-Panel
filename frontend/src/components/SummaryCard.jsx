import { useEffect, useState } from "react";

export default function SummaryCard({ data }) {
  if (!data || !data.consensus) return null;

  const { finalScore, confidenceLevel, verdict, summary } = data.consensus;

  // Normalize safely
  const normalize = (val) => {
    if (val === undefined || val === null) return null;
    return val <= 1 ? Math.round(val * 100) : Math.round(val);
  };

  const score = normalize(finalScore);
  const confidence = normalize(confidenceLevel);

  // 🔥 Safe Prediction Logic
  let prediction = "No Hire";

  if (score !== null) {
    prediction = score >= 70 ? "Hire" : "No Hire";
  } else if (verdict) {
    const lower = verdict.toLowerCase().trim();
    if (lower === "hire") prediction = "Hire";
    if (lower === "no hire") prediction = "No Hire";
  }

  const isHire = prediction === "Hire";

  // Animated score (only if score exists)
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (score === null) return;

    let start = 0;
    const duration = 800;
    const increment = score / (duration / 16);

    const animate = () => {
      start += increment;
      if (start < score) {
        setAnimatedScore(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setAnimatedScore(score);
      }
    };

    animate();
  }, [score]);

  return (
    <div className="rounded-3xl p-10 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">

      <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        AI Hiring Prediction
      </h2>

      <div className="flex flex-col items-center justify-center">

        {/* Prediction Badge */}
        <div
          className={`px-8 py-3 rounded-full text-white text-lg font-semibold shadow-lg transition-all duration-500 ${
            isHire
              ? "bg-green-500 shadow-green-500/50"
              : "bg-red-500 shadow-red-500/50"
          }`}
        >
          {prediction}
        </div>

        {/* Score */}
        {score !== null && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Overall Score
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {animatedScore}%
            </p>
          </div>
        )}

        {/* Confidence */}
        {confidence !== null && (
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Confidence: <span className="font-semibold">{confidence}%</span>
          </p>
        )}

        {/* Summary */}
        <div className="mt-8 max-w-2xl text-center">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {summary || "Evaluation completed."}
          </p>
        </div>

      </div>
    </div>
  );
}