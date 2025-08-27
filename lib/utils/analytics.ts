export type EventType = 
  | 'page_view'
  | 'product_view'
  | 'add_to_wishlist'
  | 'add_to_cart'
  | 'purchase'
  | 'search'
  | 'click'
  | 'form_submit';

export type EventData = {
  type: EventType;
  userId?: string;
  productId?: string;
  storeId?: string;
  category?: string;
  value?: number;
  metadata?: Record<string, any>;
};

export async function trackEvent(event: EventData): Promise<void> {
  // In a real implementation, you would send to an analytics service
  // For now, we'll just log the event
  
  console.log('Event tracked:', {
    ...event,
    timestamp: new Date()
  });
  
  // Simulate event tracking delay
  await new Promise(resolve => setTimeout(resolve, 50));
}

export async function trackPageView(
  path: string,
  userId?: string
): Promise<void> {
  await trackEvent({
    type: 'page_view',
    userId,
    metadata: { path }
  });
}

export async function trackProductView(
  productId: string,
  userId?: string
): Promise<void> {
  await trackEvent({
    type: 'product_view',
    userId,
    productId
  });
}

export async function trackSearch(
  query: string,
  resultsCount: number,
  userId?: string
): Promise<void> {
  await trackEvent({
    type: 'search',
    userId,
    metadata: { query, resultsCount }
  });
}