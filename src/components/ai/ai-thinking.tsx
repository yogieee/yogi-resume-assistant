export function AiThinking() {
  return (
    <div className="flex items-center gap-1 py-2 px-2">
      <span className="text-console-text-dim text-xs">yogi-ai &gt;</span>
      <span className="text-console-text-dim text-xs animate-pulse">
        Thinking
        <span className="inline-flex w-[1.5em] overflow-hidden align-bottom">
          <span className="animate-[ellipsis_1.4s_steps(4,end)_infinite]">...</span>
        </span>
      </span>
    </div>
  );
}
