export interface SalesOrder {
  _id: string;
  subject: string;
  contactName: string;
  status: string;
  total: string;
  assignedTo: string;
  creator?: string;
  description?: string;
}