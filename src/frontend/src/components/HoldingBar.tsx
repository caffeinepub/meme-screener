interface HoldingBarProps {
  creator: number;
  insiders: number;
  snipers: number;
  bundles: number;
  freshWallets: number;
}

export function HoldingBar({
  creator,
  insiders,
  snipers,
  bundles,
  freshWallets,
}: HoldingBarProps) {
  const total = creator + insiders + snipers + bundles + freshWallets;

  const segments = [
    { value: creator, color: "#25E28A", label: "Dev" },
    { value: insiders, color: "#F5C842", label: "Insiders" },
    { value: snipers, color: "#F5923E", label: "Snipers" },
    { value: bundles, color: "#D9535F", label: "Bundles" },
    { value: freshWallets, color: "#3AA0FF", label: "Fresh" },
  ].filter((s) => s.value > 0);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex rounded-full overflow-hidden"
        style={{ width: 100, height: 5 }}
        title={`Dev:${creator.toFixed(1)}% Insiders:${insiders.toFixed(1)}% Snipers:${snipers.toFixed(1)}% Bundles:${bundles.toFixed(1)}% Fresh:${freshWallets.toFixed(1)}%`}
      >
        {total === 0 ? (
          <div className="flex-1 bg-border" />
        ) : (
          segments.map((seg) => (
            <div
              key={seg.label}
              style={{
                width: `${(seg.value / 100) * 100}%`,
                backgroundColor: seg.color,
                minWidth: seg.value > 0 ? 1 : 0,
              }}
            />
          ))
        )}
      </div>
      <span className="text-xs text-muted-foreground font-mono tabular-nums">
        {total.toFixed(0)}%
      </span>
    </div>
  );
}
