import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export default function AlbumsCreatedChart({ buckets }) {
  const reduced = usePrefersReducedMotion();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={buckets} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#E8E4DA" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "rgba(39,41,35,0.55)", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#E8E4DA" }}
          minTickGap={16}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "rgba(39,41,35,0.55)", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={40}
          label={{ value: "albums", angle: -90, position: "insideLeft", fill: "rgba(39,41,35,0.45)", fontSize: 12, offset: 16 }}
        />
        <Tooltip
          cursor={{ fill: "rgba(119,124,100,0.08)" }}
          content={<CustomTooltip unit="albums" />}
        />
        <Bar
          dataKey="albums"
          name="created"
          fill="#272923"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
          isAnimationActive={!reduced}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}