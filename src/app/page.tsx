import { getTheoryModules } from '@/entities/lesson';
import { getIconicRiffs } from '@/entities/riff';
import { HomeView } from '@/views/home';

export default async function HomePage() {
  const [modules, riffs] = await Promise.all([
    getTheoryModules(),
    getIconicRiffs(),
  ]);

  return <HomeView modules={modules} riffs={riffs} />;
}
