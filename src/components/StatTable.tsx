const tds = "border px-4 py-2 text-white"

type Props = {
  stats: { [key: string]: number}
}

const StatTable = ({stats}: Props) => {
  return (
    <div className="result">
      <table className="resultStat table-auto">
        <thead>
          <tr>
              <th className={tds}></th>
              <th className={tds}>Serve Ace</th>
              <th className={tds}>Serve Error</th>
              <th className={tds}>Attack Point</th>
              <th className={tds}>Attack Error</th>
              <th className={tds}>Reception Error</th>
              <th className={tds}>Block Point</th>
          </tr>
         </thead>
        <tbody>
          <tr>
              <td className={tds} id ="StatName1">Player 1</td>
              <td className={tds} id="serveAce1">{stats["serveAce1"] || 0}</td>
              <td className={tds} id="serveError1">{stats["serveError1"] || 0}</td>
              <td className={tds} id="attackPoint1">{stats["attackPoint1"] || 0}</td>
              <td className={tds} id="attackError1">{stats["attackError1"] || 0}</td>
              <td className={tds} id="receptionError1">{stats["receptionError1"] || 0}</td>
              <td className={tds} id="blockPoint1">{stats["blockPoint1"] || 0}</td>
          </tr>
          <tr>
              <td className={tds} id ="StatName2">Player 2</td>
              <td className={tds} id="serveAce2">{stats["serveAce2"] || 0}</td>
              <td className={tds} id="serveError2">{stats["serveError2"] || 0}</td>
              <td className={tds} id="attackPoint2">{stats["attackPoint2"] || 0}</td>
              <td className={tds} id="attackError2">{stats["attackError2"] || 0}</td>
              <td className={tds} id="receptionError2">{stats["receptionError2"] || 0}</td>
              <td className={tds} id="blockPoint2">{stats["blockPoint2"] || 0}</td>
          </tr>
          <tr>
              <td className={tds} id ="StatName3">Player 3</td>
              <td className={tds} id="serveAce3">{stats["serveAce3"] || 0}</td>
              <td className={tds} id="serveError3">{stats["serveError3"] || 0}</td>
              <td className={tds} id="attackPoint3">{stats["attackPoint3"] || 0}</td>
              <td className={tds} id="attackError3">{stats["attackError3"] || 0}</td>
              <td className={tds} id="receptionError3">{stats["receptionError3"] || 0}</td>
              <td className={tds} id="blockPoint3">{stats["blockPoint3"] || 0}</td>
          </tr>
          <tr>
              <td className={tds} id ="StatName4">Player 4</td>
              <td className={tds} id="serveAce4">{stats["serveAce4"] || 0}</td>
              <td className={tds} id="serveError4">{stats["serveError4"] || 0}</td>
              <td className={tds} id="attackPoint4">{stats["attackPoint4"] || 0}</td>
              <td className={tds} id="attackError4">{stats["attackError4"] || 0}</td>
              <td className={tds} id="receptionError4">{stats["receptionError4"] || 0}</td>
              <td className={tds} id="blockPoint4">{stats["blockPoint4"] || 0}</td>
          </tr>
        </tbody>
      </table>
  </div>
  )
}

export default StatTable