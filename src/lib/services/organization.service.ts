import { connectToDatabase } from "../db";
import { Organization } from "../../models/organization.model";
import { CreateOrganizationParams, UpdateOrganizationParams, Organization as OrganizationType } from "../../types/organization";
import { logger } from "@/lib/logger/Logger";

export async function createOrganization(organizationData: CreateOrganizationParams): Promise<OrganizationType> {
  try {
    await connectToDatabase();
    
    const organizationExists = await Organization.findOne({ clerkId: organizationData.clerkId });

    if (organizationExists) {
      throw new Error("Organization already exists");
    }

    const newOrganization = await Organization.create(organizationData);
    
    return {
      id: newOrganization._id.toString(),
      clerkId: newOrganization.clerkId,
      name: newOrganization.name,
      slug: newOrganization.slug,
      imageUrl: newOrganization.imageUrl,
      createdAt: newOrganization.createdAt,
      updatedAt: newOrganization.updatedAt
    };
  } catch (error) {
    logger.error("Error creating organization:", error);
    throw error;
  }
}

export async function getOrganizationByClerkId(clerkId: string): Promise<OrganizationType | null> {
  try {
    await connectToDatabase();
    
    const organization = await Organization.findOne({ clerkId });
    
    if (!organization) return null;
    
    return {
      id: organization._id.toString(),
      clerkId: organization.clerkId,
      name: organization.name,
      slug: organization.slug,
      imageUrl: organization.imageUrl,
      createdAt: organization.createdAt,
      updatedAt: organization.updatedAt
    };
  } catch (error) {
    logger.error("Error fetching organization by Clerk ID:", error);
    throw error;
  }
}

export async function updateOrganization(clerkId: string, organizationData: UpdateOrganizationParams): Promise<OrganizationType | null> {
  try {
    await connectToDatabase();
    
    const updatedOrganization = await Organization.findOneAndUpdate(
      { clerkId },
      { $set: organizationData },
      { new: true }
    );
    
    if (!updatedOrganization) return null;
    
    return {
      id: updatedOrganization._id.toString(),
      clerkId: updatedOrganization.clerkId,
      name: updatedOrganization.name,
      slug: updatedOrganization.slug,
      imageUrl: updatedOrganization.imageUrl,
      createdAt: updatedOrganization.createdAt,
      updatedAt: updatedOrganization.updatedAt
    };
  } catch (error) {
    logger.error("Error updating organization:", error);
    throw error;
  }
}

export async function deleteOrganization(clerkId: string): Promise<boolean> {
  try {
    await connectToDatabase();
    
    const result = await Organization.deleteOne({ clerkId });
    
    return result.deletedCount > 0;
  } catch (error) {
    logger.error("Error deleting organization:", error);
    throw error;
  }
}
