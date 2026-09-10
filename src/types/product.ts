export interface Product {
  id: string;
  name: string;
  category: string;
  netWeight: string;
  mrp: number; // Current selling price
  originalMrp?: number; // Strike-through comparative price
  ingredients: string;
  fssaiLicNo: string;
  badge: string;
  rating: number;
  reviewsCount: number;
  description: string;
  image: string;
}
