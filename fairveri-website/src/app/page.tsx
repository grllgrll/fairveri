import { Hero } from '@/components/home/Hero';
import { PrincipleExplorer } from '@/components/home/PrincipleExplorer';
import { ImpactGrid } from '@/components/home/ImpactGrid';
import { RepositoriesTable } from '@/components/home/RepositoriesTable';
import { AssessmentTeaser } from '@/components/home/AssessmentTeaser';
import { Timeline } from '@/components/home/Timeline';
import { CtaBand } from '@/components/home/CtaBand';

export default function Home() {
  return (
    <>
      <Hero />
      <PrincipleExplorer />
      <ImpactGrid />
      <RepositoriesTable />
      <AssessmentTeaser />
      <Timeline />
      <CtaBand />
    </>
  );
}
