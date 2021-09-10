export interface Contact {
  _id: string;
  contactName: string;
  salutation: string;
  mobilePhone: string;
  email?: string;
  organization?: string;
  dob?: string;
  leadSrc: string;
  assignedTo: string;
  creator?: string;
  address?: string;
  description?: string;
}

export interface IParamsContact {
  page?: number;
  limit?: number;
  keyword?: string;
  leadSrc?: string;
  assignedTo?: string;
}