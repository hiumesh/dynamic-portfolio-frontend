import MaxWidthWrapper from "@/components/max-width-wrapper";
import ProfileSetupForm from "./form";

export default function ProfileSetup() {
  return (
    <MaxWidthWrapper>
      <div className="space-y-3 p-4 max-w-2xl mx-auto">
        <h1 className="text-xl">Setup Profile</h1>
        <ProfileSetupForm />
      </div>
    </MaxWidthWrapper>
  );
}
