export type Size = {
  value: number;
  units: string;
};

export type Property = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  notes: string;
  budget: number;
  lockBoxCode: string;
  organizationId: string;
  address: Address;
  accessInstructions: string;
  type: string;
  size: Size;
  orderCount: number;
};

export type Role = {
  createdAt: string;
  id: string;
  permissions: string[];
  role: string;
  type: string;
  updatedAt: string;
};

export type Address = {
  address1: string;
  address2: string;
  city: string;
  state: string;
  createdAt: string;
  id: string;
  organizationId: string;
  updatedAt: string;
  propertyId: string;
  postalCode: string;
};

type ScopeImage = {
  fileId: string;
  fileType: string;
  fileUrl: string;
  updatedAt: string;
  version: number;
};

type OrderProperty = {
  id: string;
  createdAt: string;
  organizationId: string;
  updatedAt: string;
  accessInstructions: string;
  address: Address;
};

export type Order = {
  additionalDetails: string;
  createdAt: string;
  id: string;
  organizationId: string;
  projectName: string;
  property: OrderProperty;
  scopeImages: ScopeImage[];
  scopeStatus: string;
};


export type OrderHistory = {
  orderId: string;
  orderItemCount: number;
  cost: number;
}

export interface Scope {
  projectName: string;
  organizationId: string;
  propertyId: string;
  dueDate: string;
  scopeImages: {
    fileId: string;
    fileUrl: string;
    fileType: string;
  }[];
  additionalDetails: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  property: {
    id: string;
    createdAt: string;
    updatedAt: string;
    address: Address;
  };
  scopeStatus: string;
  approvalChain: {
    level: number;
    role: string;
    status: string;
    note?: string;
  }[];
  scopeItemRevisions: ScopeItemRevision[];
}

export interface ScopeItemRevision {
  createdAt: string;
  updatedAt: string;
  revision: number;
  internalRevision: boolean;
  status: string;
  scopeItems: {
    createdAt: string;
    updatedAt: string;
    id: string;
    categoryItemId: string;
    area: string;
    scopeItemImages: {
      fileId: string;
      fileUrl: string;
      fileType: string;
    }[];
    quantity: number;
    targetClientPrice: string;
    internalComments: {
      user: string;
      comment: string;
    }[];
    externalComments: {
      user: string;
      comment: string;
    }[];
  }[];
}
