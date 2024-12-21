import { getUserWorkExperiences } from "@/services/api/user_experience";
import HackathonContainer from "./container";
import { getUserHackathons } from "@/services/api/user_hackathon";

export default async function Experiences() {
  const { data, error } = await getUserHackathons();

  if (error) throw new Error(error.message);

  return <HackathonContainer hackathons={data || []} />;
}
