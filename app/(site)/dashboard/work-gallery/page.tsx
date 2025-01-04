import { findAll } from "@/services/api/work-gallery";
import WorkGalleryContainer from "./container";

export default async function Experiences() {
  const { data, error } = await findAll();

  if (error) throw new Error(error.message);

  return <WorkGalleryContainer items={data || []} />;
}
