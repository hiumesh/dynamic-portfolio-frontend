import ProfileCard from "./profile-card";
import SkillsCard from "./skills-card";
// import TabContainer from "./tab-container";

export default function Dashobard() {
  return (
    <div className="grid grid-cols-8">
      <ProfileCard className="col-span-4  " />
      <SkillsCard className="col-span-4" />
    </div>
  );
}
