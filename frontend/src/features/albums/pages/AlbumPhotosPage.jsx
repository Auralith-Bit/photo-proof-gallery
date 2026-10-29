import { useParams } from "react-router-dom";
import PhotosTab from "../../../components/album/PhotosTab";

export default function AlbumPhotosPage() {
  const { albumId } = useParams();
  return <PhotosTab albumId={albumId} />;
}