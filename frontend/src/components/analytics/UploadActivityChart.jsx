import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export default function UploadActivityChart({ buckets }) {
  const reduced = usePrefersReducedMotion();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={buckets} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="uploadFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#777C64" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#777C64" stopOpacity={0.02} />
          </linearGradient>
        </defs>
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
          width={44}
          label={{ value: "photos", angle: -90, position: "insideLeft", fill: "rgba(39,41,35,0.45)", fontSize: 12, offset: 16 }}
        />
        <Tooltip content={<CustomTooltip unit="photos" />} />
        <Area
          type="monotone"
          dataKey="photos"
          name="uploaded"
          stroke="#777C64"
          strokeWidth={2}
          fill="url(#uploadFill)"
          isAnimationActive={!reduced}
          dot={false}
          activeDot={{ r: 4, fill: "#777C64" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}