import { Link } from "react-router-dom"

import gamesImage from "../assets/images/games.png"
import inputImage from "../assets/images/input1.png"
import games2Image from "../assets/images/games2.png"

const steps = [
  {
    number: "01",
    title: "Create or open a match",
    text: "Start from Games. Choose beach or training, name the teams, set the player count, and open the match dashboard.",
    image: gamesImage,
    alt: "RallyIQ games list",
  },
  {
    number: "02",
    title: "Track actions live",
    text: "Select the player, tap the action, and RallyIQ updates the score, event log, totals, and set-by-set statistics.",
    image: inputImage,
    alt: "RallyIQ live input screen",
  },
  {
    number: "03",
    title: "Review and share",
    text: "Save the match, inspect each set, keep it private, or make it public so others can view it in read-only mode.",
    image: games2Image,
    alt: "RallyIQ public games view",
  },
]

const HowItWorksPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            How it works
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            RallyIQ keeps scoring fast while the stats build themselves.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Built for live volleyball tracking: quick input during the match,
            readable logs after every rally, and reports that can stay private
            or be shared publicly.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/demo"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-500"
            >
              Try Demo
            </Link>

            <Link
              to="/games"
              className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-black text-white hover:border-cyan-400"
            >
              Open Games
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl space-y-10">
        {steps.map((step, index) => (
          <article
            key={step.number}
            className="
              grid
              gap-6
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/60
              p-5
              lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
              lg:items-center
            "
          >
            <div
              className={`
                ${index % 2 === 1 ? "lg:order-2" : ""}
              `}
            >
              <span className="text-sm font-black text-cyan-300">
                {step.number}
              </span>

              <h2 className="mt-3 text-2xl font-black">
                {step.title}
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                {step.text}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
              <img
                src={step.image}
                alt={step.alt}
                className="h-full w-full object-cover"
              />
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default HowItWorksPage
