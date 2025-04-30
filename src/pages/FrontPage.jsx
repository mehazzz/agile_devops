import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function FrontPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "📚",
      title: "Smart Learning",
      desc: "AI-powered study plans designed to maximize your learning outcomes.",
    },
    {
      icon: "🎯",
      title: "Goal Tracking",
      desc: "Set academic goals and monitor your progress with intelligent insights.",
    },
    {
      icon: "📆",
      title: "Task & Planner",
      desc: "Organize your tasks and deadlines with our intuitive planner system.",
    },
    {
      icon: "📊",
      title: "GPA Insights",
      desc: "Track your academic performance and plan improvements effectively.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-indigo-900 to-indigo-700 py-16 px-4 text-white text-center shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Welcome to <span className="text-yellow-300">EduSync</span>
          </h1>
          <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto font-light">
            Your personalized hub for organizing, planning, and excelling in your academic life.
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <section className="max-w-6xl px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-8 shadow-md border hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
            whileHover={{ scale: 1.03 }}
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-semibold text-indigo-800">{feature.title}</h3>
            <p className="text-gray-600 mt-3 text-base">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-16"
      >
        <button
          onClick={() => navigate("/authpage")}
          className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg transition-all duration-200"
        >
          🚀 Get Started with EduSync
        </button>
      </motion.div>
    </div>
  );
}
