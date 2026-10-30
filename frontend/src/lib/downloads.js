async function downloadOne(url, name) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("response not ok");
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = name || "photo.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objUrl), 1500);
  } catch {
    // Cross-origin body unreadable: open the resource instead of failing silently.
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.download = name || "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

export async function downloadPhoto(photo) {
  await downloadOne(photo.url, photo.filename);
}

export async function downloadPhotos(photos) {
  for (const photo of photos) {
    // eslint-disable-next-line no-await-in-loop
    await downloadOne(photo.url, photo.filename);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 350)); // breathe between files
  }
}