const PathTables = ({ explored, path }) => {
  return (
    <div className="space-y-4">
      {/* Scoreboard */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rotate-[-1deg] rounded-3xl border-2 border-slate-900 bg-amber-200 p-4 text-center shadow-[3px_3px_0_0_#0f172a]">
          <p className="text-xs font-black uppercase tracking-widest text-slate-700">Tiles sniffed</p>
          <p className="mt-1 font-mono text-3xl font-black">{explored.length}</p>
        </div>
        <div className="rotate-[1deg] rounded-3xl border-2 border-slate-900 bg-emerald-300 p-4 text-center shadow-[3px_3px_0_0_#0f172a]">
          <p className="text-xs font-black uppercase tracking-widest text-slate-700">Escape steps</p>
          <p className="mt-1 font-mono text-3xl font-black">{path.length}</p>
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border-2 border-slate-900 bg-white shadow-[3px_3px_0_0_#0f172a]">
          <div className="border-b-2 border-slate-900 bg-sky-200 px-4 py-2.5">
            <h2 className="text-sm font-black">Sniff order</h2>
          </div>
          <div className="thin-scrollbar max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-left text-xs font-bold text-slate-500">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Tile</th>
                </tr>
              </thead>
              <tbody>
                {explored.map((cell, index) => (
                  <tr key={index} className="border-b border-slate-100 last:border-0 odd:bg-amber-50/50">
                    <td className="px-4 py-1.5 font-mono text-[13px] font-bold text-slate-500">{index + 1}</td>
                    <td className="px-4 py-1.5 font-mono text-[13px] font-bold">[{cell[0]}, {cell[1]}]</td>
                  </tr>
                ))}
                {explored.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-sm font-medium text-slate-400">
                      Press GO and watch the trail grow here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border-2 border-slate-900 bg-white shadow-[3px_3px_0_0_#0f172a]">
          <div className="border-b-2 border-slate-900 bg-emerald-200 px-4 py-2.5">
            <h2 className="text-sm font-black">Escape route</h2>
          </div>
          {path.length > 0 ? (
            <div className="thin-scrollbar max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-b border-slate-200 text-left text-xs font-bold text-slate-500">
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Tile</th>
                  </tr>
                </thead>
                <tbody>
                  {path.map((cell, index) => (
                    <tr key={index} className="border-b border-slate-100 last:border-0 odd:bg-emerald-50/60">
                      <td className="px-4 py-1.5 font-mono text-[13px] font-bold text-slate-500">{index + 1}</td>
                      <td className="px-4 py-1.5 font-mono text-[13px] font-bold">[{cell[0]}, {cell[1]}]</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 py-6 text-center text-sm font-medium text-slate-400">
              No escape yet — finish a race first!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PathTables;
