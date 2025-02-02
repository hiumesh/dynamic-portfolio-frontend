import HackathonContainer from "./container";
import { getUserHackathons } from "@/services/api/hackathon";

export default async function Experiences() {
  const { data, error } = await getUserHackathons();

  if (error) throw new Error(error.message);

  return <HackathonContainer hackathons={data || []} />;
}
