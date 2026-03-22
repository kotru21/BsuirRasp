import { HomePage, loadHomePageProps, type HomePageSearchParams } from "@/views/home";

interface PageProps {
  searchParams: Promise<HomePageSearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const props = await loadHomePageProps(params);
  return <HomePage {...props} />;
}
