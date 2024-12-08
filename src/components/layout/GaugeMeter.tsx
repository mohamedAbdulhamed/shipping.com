import * as React from "react";
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from "@mui/x-charts/Gauge";

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="red" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="red"
        strokeWidth={3}
      />
    </g>
  );
}

function GaugeTicks({ valueMax }: { valueMax: number }) {
  const { cx, cy, outerRadius, startAngle, endAngle } = useGaugeState();
  const ticks = 10; // Number of ticks
  
  const tickElements = Array.from({ length: ticks + 1 }).map((_, index) => {
    const tickWeight = Math.round((index * valueMax) / ticks);
    const isMajorTick = index % 2 === 0;
    const tickLength = isMajorTick ? 20 : 10; // Length of each tick
    // Calculate angle for each tick
    const angle = startAngle + (index * (endAngle - startAngle)) / ticks;
    const x1 = cx + outerRadius * Math.sin(angle);
    const y1 = cy - outerRadius * Math.cos(angle);
    const x2 = cx + (outerRadius - tickLength) * Math.sin(angle);
    const y2 = cy - (outerRadius - tickLength) * Math.cos(angle);

    // Calculate position for labels (slightly outside the tick line)
    const labelX = cx + (outerRadius - tickLength - 15) * Math.sin(angle);
    const labelY = cy - (outerRadius - tickLength - 15) * Math.cos(angle);

    return (
      <g key={index}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="black"
          strokeWidth={2}
          aria-label={`${tickWeight} kg`}
        />
        {isMajorTick && (
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={12}
            fill="black"
          >
            {tickWeight}
          </text>
        )}
      </g>
    );
  });

  return <g>{tickElements}</g>;
}

export default function GaugeMeter({
  value = 0,
  valueMax = 100,
  fillColor = "#90caf9",
}: {
  value: number;
  valueMax: number;
  fillColor: string;
}) {
  return (
    <GaugeContainer
      // TODO: Make the container responsive.
      width={200}
      height={200}
      startAngle={-110}
      endAngle={110}
      value={value}
      valueMax={valueMax}
    >
      <GaugeReferenceArc />
      <GaugeValueArc style={{ fill: fillColor }} />
      <GaugePointer />
      <GaugeTicks valueMax={valueMax} />
    </GaugeContainer>
  );
}
