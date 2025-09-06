import axios from 'axios';
import { revalidateBannerCache } from '@/lib/data/banners';
import { getFileInfo } from '@/lib/utils/file-upload';

const API_BASE_URL = '/api/banners';

export interface Banner {
  id: number;
  title: string;
  image: string;
  url: string | null;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerData {
  title: string;
  image: string;
  url?: string;
  position?: number;
  isActive?: boolean;
}

export interface UpdateBannerData {
  title?: string;
  image?: string;
  url?: string;
  position?: number;
  isActive?: boolean;
}

// Get all banners
export const getBanners = async (): Promise<Banner[]> => {
  try {
    const response = await axios.get(API_BASE_URL);
    // The API returns { success: true, data: [...] }, so we need response.data.data
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

// Get banner by ID
export const getBannerById = async (id: number): Promise<Banner> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching banner with ID ${id}:`, error);
    throw error;
  }
};

// Create a new banner
export const createBanner = async (bannerData: CreateBannerData): Promise<Banner> => {
  try {
    const response = await axios.post(API_BASE_URL, bannerData);
    // Invalidate cache after creating banner
    await revalidateBannerCache();
    return response.data.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

// Update a banner
export const updateBanner = async (id: number, bannerData: UpdateBannerData): Promise<Banner> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, bannerData);
    // Invalidate cache after updating banner
    await revalidateBannerCache();
    return response.data.data;
  } catch (error) {
    console.error(`Error updating banner with ID ${id}:`, error);
    throw error;
  }
};

// Delete a banner
export const deleteBanner = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    // Invalidate cache after deleting banner
    await revalidateBannerCache();
  } catch (error) {
    console.error(`Error deleting banner with ID ${id}:`, error);
    throw error;
  }
};

// Toggle banner status
export const toggleBannerStatus = async (id: number, isActive: boolean): Promise<Banner> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { isActive });
    // Invalidate cache after toggling banner status
    await revalidateBannerCache();
    return response.data.data;
  } catch (error) {
    console.error(`Error toggling status for banner with ID ${id}:`, error);
    throw error;
  }
};

// Upload banner image file via API
export const uploadBannerImageFile = async (file: File): Promise<{ url: string; fileName: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/banner', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    return { url: result.data.url, fileName: file.name };
  } catch (error) {
    console.error('Error uploading banner image:', error);
    throw error;
  }
};

// Delete banner image file via API
export const deleteBannerImageFile = async (imageUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/upload/banner?url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.data.deleted === true;
  } catch (error) {
    console.error('Error deleting banner image:', error);
    return false;
  }
};

// Get file information
export const getBannerImageInfo = (imageUrl: string) => {
  return getFileInfo(imageUrl);
};