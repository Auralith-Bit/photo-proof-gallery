import QRCode from "qrcode";

export function buildAlbumLink(album) {
  return `${window.location.origin}/a/${album.accessToken}/gallery`;
}

export async function downloadAlbumQr(album) {
  const dataUrl = await QRCode.toDataURL(buildAlbumLink(album), {
    margin: 2,
    width: 512,
    color: { dark: "#272923", light: "#FFFFFF" },
  });
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = `${album.title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
  anchor.click();
}