
import { CategorySectionClient } from '@/components/category-section-client';

/**
 * This is a Server Component whose only job is to render the Client Component
 * that will fetch and display the category data. This pattern is efficient
 * as it keeps the server-rendered payload small.
 */
export default function ServerCategoryData() {
  // This component no longer needs to fetch or pass props.
  // It simply renders the client component, which handles its own data.
  return <CategorySectionClient />;
}
