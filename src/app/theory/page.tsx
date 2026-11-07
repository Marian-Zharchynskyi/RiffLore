import { getTheoryModules } from '@/entities/lesson';
import { TheoryCurriculumView } from '@/views/theory-curriculum';

export default async function TheoryPage() {
  const modules = await getTheoryModules();
  return <TheoryCurriculumView modules={modules} />;
}
