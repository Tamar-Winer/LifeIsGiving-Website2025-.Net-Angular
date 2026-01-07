export interface Prize {
  id: number;
  name: string;
  description: string;
  category: number;
  price: number; // ← במקום ticketPrice
  imageUrl?: string;
  donorId: number;
}
