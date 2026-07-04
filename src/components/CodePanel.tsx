const CodePanel = () => {
  /*     
    Mimics close, minimise, maximise controls from macOS code editors/terminals.
    Purely visual, offering instant recognisability.
    */
  const TrafficLights = () => {
    return (
      <div className="flex gap-1.5 px-4 py-3 border-b border-faint shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
        <span className="ml-auto text-[0.6rem] text-muted tracking-wide">
          xander.ts
        </span>
      </div>
    )
  }

  return (
    <div className="aspect-4/5 max-h-[480px] rounded-sm overflow-hidden border border-faint bg-[#13121a] font-mono text-[13px] flex flex-col">
      <TrafficLights />
      {/* Code */}
      <div className="p-6 leading-[1.95] text-[#ccc8be] overflow-hidden">
        <div>
          <span className="text-purple-400">export</span>{' '}
          <span className="text-purple-400">async</span>{' '}
          <span className="text-purple-400">function</span>{' '}
          <span className="text-blue-300">build</span>() {'{'}
        </div>
        <div>
          &nbsp;&nbsp;<span className="text-purple-400">const</span> idea ={' '}
          <span className="text-green-300">'something useful'</span>
        </div>
        <div>
          &nbsp;&nbsp;
          <span className="text-muted">// design → build → ship</span>
        </div>
        <div className="mt-1">
          &nbsp;&nbsp;<span className="text-purple-400">const</span> result ={' '}
          <span className="text-purple-400">await</span>{' '}
          <span className="text-blue-300">deploy</span>(idea)
        </div>
        <div>
          &nbsp;&nbsp;<span className="text-purple-400">return</span> result
        </div>
        <div>{'}'}</div>
        <div className="mt-6 text-muted text-[0.7rem]">
          <span className="text-accent/60">▸</span> currently:{' '}
          <span className="text-accent">
            {'about.isOpenToWork' ? 'open to work' : 'heads down building'}
          </span>
        </div>
        <div className="mt-8 border-t border-faint pt-6 flex flex-col gap-3">
          {[
            {
              label: 'Stack',
              value: 'Next.js · TypeScript · Postgres',
            },
            { label: 'Based in', value: 'London, UK' },
            { label: 'Focus', value: 'Full-stack · Systems' },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3 text-[0.7rem]">
              <span className="text-muted w-16 shrink-0">{label}</span>
              <span className="text-[#ccc8be]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
