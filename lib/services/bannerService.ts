import axios from 'axios';

const API_BASE_URL = '/api/banners';

export interface Banner {
  id: string;
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
export const getBannerById = async (id: string): Promise<Banner> => {
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
    return response.data.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

// Update a banner
export const updateBanner = async (id: string, bannerData: UpdateBannerData): Promise<Banner> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, bannerData);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating banner with ID ${id}:`, error);
    throw error;
  }
};

// Delete a banner
export const deleteBanner = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting banner with ID ${id}:`, error);
    throw error;
  }
};

// Toggle banner status
export const toggleBannerStatus = async (id: string, isActive: boolean): Promise<Banner> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { isActive });
    return response.data.data;
  } catch (error) {
    console.error(`Error toggling status for banner with ID ${id}:`, error);
    throw error;
  }
};