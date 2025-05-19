export type Organization = {
  id: string;
  clerkId: string;
  name: string;
  slug?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateOrganizationParams = {
  clerkId: string;
  name: string;
  slug?: string;
  imageUrl?: string;
};

export type UpdateOrganizationParams = Partial<Omit<Organization, "id" | "clerkId" | "createdAt">>;
