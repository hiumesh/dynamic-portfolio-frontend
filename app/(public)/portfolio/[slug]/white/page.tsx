import { getBySlug, getSubDomainBySlug } from "@/services/api/portfolio";
import AboutSection from "./about";
import FooterSection from "./footer";
import Hero from "./hero";
import Navbar from "./navbar";
import ProjectsSection from "./projects";
import SkillsSection from "./skills";
import WorkExperienceSection from "./work-experience";
import { Skills } from "@/types/api/metadata";

export default async function White({ params }: { params: { slug: string } }) {
  const portfolio = await getBySlug(params.slug);
  if (portfolio.error) throw new Error(portfolio.error.message);
  const skills = await getSubDomainBySlug(params.slug, "skills");
  if (skills.error) throw new Error(skills.error.message);
  const workExperiences = await getSubDomainBySlug(
    params.slug,
    "work_experiences"
  );
  if (workExperiences.error) throw new Error(workExperiences.error.message);
  const projects = await getSubDomainBySlug(params.slug, "works");
  if (projects.error) throw new Error(projects.error.message);

  return (
    <>
      <main className="min-h-screen">
        <Navbar />
        <Hero portfolio={portfolio.data as Portfolio} />
        <AboutSection portfolio={portfolio.data as Portfolio} />
        <SkillsSection skills={skills.data as Skills} />
        <WorkExperienceSection
          data={workExperiences.data as UserWorkExperiences}
        />
        <ProjectsSection data={projects.data as WorkGalleryItems} />
      </main>
      <FooterSection />
    </>
  );
}
