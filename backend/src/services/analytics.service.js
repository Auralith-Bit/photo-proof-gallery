import Album from "../models/Album.js";
import Photo from "../models/Photo.js";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startOfDay(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDay(d) {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
}

function granularityFor(days) {
  if (days <= 10) return "day";
  if (days <= 120) return "week";
  return "month";
}

function formatDayLabel(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

function formatWeekLabel(date) {
  return `W/ ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

function formatMonthLabel(date) {
  const yr = String(date.getFullYear()).slice(-2);
  return `${MONTH_NAMES[date.getMonth()]} '${yr}`;
}

const getAnalytics = async (userId, query = {}) => {
  const { preset = "30", from, to } = query;
  const now = new Date();
  const todayEnd = endOfDay(now);

  let start;
  let end = todayEnd;
  let days;

  if (preset === "custom" && from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime()) && fromDate <= toDate) {
      start = startOfDay(fromDate);
      end = toDate > now ? todayEnd : endOfDay(toDate);
    } else {
      start = startOfDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000));
    }
  } else {
    const numDays = Number(preset) || 30;
    start = startOfDay(new Date(now.getTime() - (numDays - 1) * 24 * 60 * 60 * 1000));
  }

  days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1);
  const granularity = granularityFor(days);

  // Fetch albums created by this photographer
  const userAlbums = await Album.find({ photographer: userId }).select("_id createdAt");
  const albumIds = userAlbums.map((a) => a._id);

  // Fetch photos uploaded in this photographer's albums
  const photos = await Photo.find({
    albumId: { $in: albumIds },
    createdAt: { $gte: start, $lte: end },
  }).select("_id createdAt");

  const filteredAlbums = userAlbums.filter(
    (a) => a.createdAt && a.createdAt >= start && a.createdAt <= end
  );

  // Build daily slots
  const dailySlots = [];
  const cur = new Date(start);
  while (cur <= end) {
    const dayStart = startOfDay(cur);
    const dayEnd = endOfDay(cur);

    const albumsCount = filteredAlbums.filter(
      (a) => a.createdAt >= dayStart && a.createdAt <= dayEnd
    ).length;

    const photosCount = photos.filter(
      (p) => p.createdAt >= dayStart && p.createdAt <= dayEnd
    ).length;

    dailySlots.push({
      date: new Date(cur),
      albums: albumsCount,
      photos: photosCount,
    });

    cur.setDate(cur.getDate() + 1);
  }

  let buckets = [];

  if (granularity === "day") {
    buckets = dailySlots.map((d) => ({
      label: formatDayLabel(d.date),
      albums: d.albums,
      photos: d.photos,
    }));
  } else if (granularity === "week") {
    // Group into weekly buckets
    let currentBucket = null;
    let dayCount = 0;

    dailySlots.forEach((d) => {
      if (!currentBucket || dayCount >= 7) {
        currentBucket = {
          label: formatWeekLabel(d.date),
          albums: 0,
          photos: 0,
        };
        buckets.push(currentBucket);
        dayCount = 0;
      }
      currentBucket.albums += d.albums;
      currentBucket.photos += d.photos;
      dayCount += 1;
    });
  } else {
    // Group into monthly buckets
    const monthMap = new Map();
    dailySlots.forEach((d) => {
      const key = `${d.date.getFullYear()}-${d.date.getMonth()}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          label: formatMonthLabel(d.date),
          albums: 0,
          photos: 0,
        });
      }
      const b = monthMap.get(key);
      b.albums += d.albums;
      b.photos += d.photos;
    });
    buckets = Array.from(monthMap.values());
  }

  const totals = {
    albums: filteredAlbums.length,
    photos: photos.length,
  };

  return {
    sample: false,
    range: {
      start: start.toISOString(),
      end: end.toISOString(),
      days,
      granularity,
    },
    buckets,
    totals,
  };
};

export default {
  getAnalytics,
};
