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
  accessContact: string;
  noOfRooms: number;
  noOfBathrooms: number;
  type: string;
  size: Size;
  orderCount: number;
  frontImages: { fileUrl: string }[];
  backImages: { fileUrl: string }[];
  leftImages: { fileUrl: string }[];
  rightImages: { fileUrl: string }[];
  assigneeId: string | null;
  assignee: User | null;
};

export type Role = {
  createdAt: string;
  id: string;
  permissions: string[];
  type: string;
  updatedAt: string;
};

export type OrganizationRole = {
  roleName: string;
  roleId: string;
  organizationId: string;
  permissions: string[];
  organizationType: string;
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
  budget: number;
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
  property: Property;
  scopeStatus: string;
  approvalChain: {
    level: number;
    role: string;
    status: string;
    note?: string;
  }[];
  scopeItemRevisions: ScopeItemRevision[];
}

export interface ScopeItem {
  createdAt: string;
  updatedAt: string;
  id: string;
  categoryItemId: string;
  categoryItem?: CategoryItem;
  area: string;
  status?: string;
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
}

export interface ScopeItemRevision {
  createdAt: string;
  updatedAt: string;
  revision: number;
  internalRevision: boolean;
  status: string;
  scopeItems: ScopeItem[];
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  roleId: string;
  markets: string[];
  profileImage: {
    fileId: string;
    fileUrl: string;
    fileType: string;
  };
}

export type Organization = {
  organizationId: string;
  roleId: string;
  userId: string;
  name: string;
}

export type CategoryItem = {
  id: string;
  lineItem: string;
  taskDescription: string;
  targetClientPrice: string;
  costCategory: string;
  costCode: string;
  options: string;
  notes: string;
  uom: string;
  materialId: string;
  originalMaterialId: string;
  targetVendorPrice: string;
  equipmentUsageRental: string;
};

export type Market = {
  id: string;
  city: string;
  countyName: string;
  state: string;
  stateId: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  dateTime: string;
  message: {
    title: string;
    body: string;
  };
};

export type ImageFile = {
  data: File;
  url: string;
}

export type Session = {
  accessToken: string;
  user: User;
  expiresAt: number;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
};

export type UserOrganization = {
  createdAt: Date;
  name: string;
  organizationId: string;
  role: OrganizationRole;
  roleId: string;
  type: string;
  updatedAt: Date;
  userId: string;
  user?: User;
};