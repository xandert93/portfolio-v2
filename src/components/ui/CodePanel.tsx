const CodePanel = () => {
  const isOpenToWork = true

  return (
    <div className="border-faint flex aspect-4/5 max-h-120 flex-col overflow-hidden rounded-sm border bg-[#13121a] font-mono text-[13px]">
      <TrafficLights />
      {/* Code */}
      <div className="overflow-hidden p-6 leading-[1.95] text-[#ccc8be]">
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
        <div className="text-muted mt-6 text-[0.7rem]">
          <span className="text-accent/60">▸</span> currently:{' '}
          <span className="text-accent">
            {isOpenToWork ? 'available for work' : 'heads down building'}
          </span>
        </div>
        <div className="border-faint mt-8 flex flex-col gap-3 border-t pt-6">
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

/*     
    Mimics close, minimise, maximise controls from macOS code editors/terminals.
    Purely visual, offering instant recognisability.
    */
const TrafficLights = () => {
  return (
    <div className="border-faint flex shrink-0 gap-1.5 border-b px-4 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
      <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
      <span className="text-muted ml-auto text-[0.6rem] tracking-wide">xander.ts</span>
    </div>
  )
}
