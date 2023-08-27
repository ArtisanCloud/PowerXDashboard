export interface Logistics {
  orderId?: number;
  status?: string;
  trackingCode?: string;
  carrier?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
}

export function getDefaultLogistics(): Logistics {
  // Provide a valid default logistics object
  return {
    orderId: 0,
    status: '',
    trackingCode: '',
    carrier: '',
    estimatedDeliveryDate: '',
    actualDeliveryDate: '',
  } as Logistics;
}
