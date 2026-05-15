import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section
        className="
          relative
          flex
          min-h-[calc(100vh-88px)]
          items-center
          overflow-hidden
          px-6
          py-20
        "
      >
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-black" />

        <div
          className="
            relative
            z-10
            mx-auto
            grid
            w-full
            max-w-6xl
            gap-10
            lg:grid-cols-[minmax(0,1fr)_360px]
            lg:items-center
          "
        >
          <div className="max-w-3xl">
            <p
              className="
                text-sm
                font-bold
                uppercase
                tracking-[0.25em]
                text-cyan-300
              "
            >
              Volleyball match intelligence
            </p>

            <h1
              className="
                mt-5
                max-w-4xl
                text-5xl
                font-black
                leading-tight
                tracking-normal
                text-white
                sm:text-6xl
                lg:text-7xl
              "
            >
              RallyIQ
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Track every rally, save set-by-set statistics, and share public
              match reports without losing the live scoring flow.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/games"
                className="
                  rounded-xl
                  bg-blue-600
                  px-6
                  py-3
                  text-sm
                  font-black
                  text-white
                  shadow-lg
                  shadow-blue-600/25
                  transition
                  hover:bg-blue-500
                  active:scale-95
                "
              >
                Open RallyIQ
              </Link>

              <Link
                to="/register"
                className="
                  rounded-xl
                  border
                  border-slate-500
                  bg-slate-950/40
                  px-6
                  py-3
                  text-sm
                  font-black
                  text-white
                  transition
                  hover:border-cyan-300
                  hover:bg-slate-900
                "
              >
                Create Account
              </Link>

              <Link
                to="/demo"
                className="
                  rounded-xl
                  border
                  border-cyan-400/60
                  bg-cyan-400/10
                  px-6
                  py-3
                  text-sm
                  font-black
                  text-cyan-100
                  transition
                  hover:border-cyan-300
                  hover:bg-cyan-400/20
                "
              >
                Try Demo
              </Link>
            </div>
          </div>

          <div
            className="
              hidden
              rounded-2xl
              border
              border-white/10
              bg-slate-950/70
              p-5
              shadow-2xl
              lg:block
            "
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Live match
                </p>
                <p className="mt-1 text-lg font-black">
                  Set 2
                </p>
              </div>

              <div className="text-right">
                <p className="text-4xl font-black">
                  21 : 15
                </p>
                <p className="text-xs text-slate-400">
                  Sets 1 - 0
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              {[
                ["Serve Ace", "77 Pita", "5-2"],
                ["Attack Kill", "17 Santos", "6-4"],
                ["Serve Error", "3 Leppik", "6-5"],
              ].map(([event, player, score]) => (
                <div
                  key={`${event}-${player}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-xl bg-slate-900 px-4 py-3"
                >
                  <div>
                    <p className="font-bold text-white">
                      {player}
                    </p>
                    <p className="text-slate-400">
                      {event}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-300 px-2.5 py-1 font-black text-slate-950">
                    {score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-950 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-black">
              From first serve to match report.
            </h2>

            <Link
              to="/how-it-works"
              className="mt-5 inline-flex rounded-xl border border-slate-700 px-4 py-2 text-sm font-black text-white hover:border-cyan-300"
            >
              View full guide
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create a match",
                text: "Choose beach or training, name the teams, set player counts, and start the score sheet.",
              },
              {
                step: "2",
                title: "Track every rally",
                text: "Tap the player, record the action, and RallyIQ updates score, log, and set statistics instantly.",
              },
              {
                step: "3",
                title: "Review and share",
                text: "Open match totals, check each set, keep it private, or publish a read-only report.",
              },
            ].map((item) => (
              <article
                key={item.step}
                className="
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/70
                  p-6
                "
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-black">
                  {item.step}
                </div>

                <h3 className="mt-5 text-xl font-black">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-950 px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-800 bg-slate-800 md:grid-cols-3">
          {[
            {
              label: "Live",
              title: "Track the match live",
              text: "Record attacks, blocks, aces, errors, score, sets, and player impact as the game happens.",
            },
            {
              label: "Sets",
              title: "Set-by-set stats",
              text: "Review full-match totals or jump into each set to see where the momentum changed.",
            },
            {
              label: "Share",
              title: "Private or public",
              text: "Keep matches visible only to you or publish them for others to review in read-only mode.",
            },
          ].map((feature) => (
            <article
              key={feature.title}
              className="
                bg-slate-950
                p-6
                transition
                hover:bg-slate-900
              "
            >
              <div className="flex items-start gap-4">
                <span className="rounded-full bg-blue-600/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-cyan-300">
                  {feature.label}
                </span>

                <div>
                  <h2 className="text-lg font-black">
                    {feature.title}
                  </h2>

                  <p className="mt-2 leading-7 text-slate-400">
                    {feature.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Hero
