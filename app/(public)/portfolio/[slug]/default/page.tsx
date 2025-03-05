import CertificationSection from "./certification";
import EducationSection from "./education";
import HackathonSection from "./hackathon";
import HeroSection from "./hero";
import ProjectSection from "./projects";
import SkillSection from "./skill";
import WorkExperienceSection from "./work-experience";

export default function Magma() {
  return (
    <div className="border-gray-600">
      <HeroSection />
      <SkillSection />
      <WorkExperienceSection />
      <EducationSection />
      <CertificationSection />
      <HackathonSection />
      <ProjectSection />
    </div>
  );
}
