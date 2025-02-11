import { getUserWorkExperiences } from "@/services/api/experience";
import ExperienceContainer from "./container";

export default async function Experiences() {
  const { data, error } = await getUserWorkExperiences();

  if (error) throw new Error(error.message);

  return <ExperienceContainer experiences={data || []} />;
}
