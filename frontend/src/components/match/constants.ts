// Define new actions
export const statTypes = [
  "totalPoints",
  "plussesMinuses",
  "serveAce",
  "serveError",
  "receptionError",
  "attackPoint",
  "attackError",
  "blockPoint",
]

// Also here for stats table
export const statLabels: Record<string, string> = {
  totalPoints: "Total Points",
  plussesMinuses: "+/-",
  serveAce: "Serve Ace",
  serveError: "Serve Error",
  attackPoint: "Attack Point",
  attackError: "Attack Error",
  receptionError: "Reception Error",
  blockPoint: "Block Point",
}

// Changable actions that player can do
export const actions = [
  {
    label: "Attack Kill",
    type: "attackPoint",
    color: "bg-green-600 hover:bg-green-500",
  },
  {
    label: "Attack Error",
    type: "attackError",
    color: "bg-red-600 hover:bg-red-500",
  },
  {
    label: "Ace",
    type: "serveAce",
    color: "bg-green-600 hover:bg-green-500",
  },
  {
    label: "Block",
    type: "blockPoint",
    color: "bg-green-600 hover:bg-green-500",
  },
]

