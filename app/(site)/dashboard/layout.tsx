import MaxWidthWrapper from "@/components/max-width-wrapper";
import Navbar from "@/components/navbar";
import TabContainer from "./tab-container";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <MaxWidthWrapper>
        <div>
          <TabContainer />
          {children}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
