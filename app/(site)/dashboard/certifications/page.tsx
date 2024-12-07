import { getUserCertifications } from "@/services/api/user-certification";
import CertificateContainer from "./container";

export default async function Certifications() {
  const { data, error } = await getUserCertifications();

  if (error) throw new Error(error.message);

  return <CertificateContainer certifications={data || []} />;
}
