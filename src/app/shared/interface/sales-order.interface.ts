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

export interface IParamsSalesOrder {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortValue?: string;
}
