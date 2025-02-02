import { getUserEducations } from "@/services/api/educations";
import EducationContainer from "./container";

export default async function Educations() {
  const { data, error } = await getUserEducations();

  if (error) throw new Error(error.message);

  return <EducationContainer educations={data || []} />;
}
