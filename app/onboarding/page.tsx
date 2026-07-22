import OnboardingWizard from "./OnboardingWizard";

type Props = {
  searchParams: Promise<{
    plano?: string;
  }>;
};

export default async function OnboardingPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-100 px-5 py-14">
      <OnboardingWizard
        selectedPlan={params.plano ?? null}
      />
    </main>
  );
}