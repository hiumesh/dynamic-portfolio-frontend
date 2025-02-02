import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <MaxWidthWrapper>
      <div className="flex flex-col gap-5">{children}</div>
    </MaxWidthWrapper>
  );
}
