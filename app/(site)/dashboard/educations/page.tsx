import { getUserEducations } from "@/services/api/user-educations";
import EducationContainer from "./container";

export default async function Educations() {
  const data = await getUserEducations();

  return <EducationContainer educations={data || []} />;
}
