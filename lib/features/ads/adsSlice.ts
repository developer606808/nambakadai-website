import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Ad {
  id: string
  title: string
  description: string
  price: number
  category: string
  location: string
  images: string[]
  sellerId: string
  sellerName: string
  createdAt: string
  featured: boolean
  verified: boolean
}

interface AdsState {
  ads: Ad[]
  featuredAds: Ad[]
  userAds: Ad[]
  isLoading: boolean
  error: string | null
  filters: {
    category: string
    location: string
    priceRange: [number, number]
    searchQuery: string
  }
}

const initialState: AdsState = {
  ads: [],
  featuredAds: [],
  userAds: [],
  isLoading: false,
  error: null,
  filters: {
    category: "",
    location: "",
    priceRange: [0, 10000],
    searchQuery: "",
  },
}

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    setAds: (state, action: PayloadAction<Ad[]>) => {
      state.ads = action.payload
    },
    setFeaturedAds: (state, action: PayloadAction<Ad[]>) => {
      state.featuredAds = action.payload
    },
    setUserAds: (state, action: PayloadAction<Ad[]>) => {
      state.userAds = action.payload
    },
    addAd: (state, action: PayloadAction<Ad>) => {
      state.ads.unshift(action.payload)
      state.userAds.unshift(action.payload)
    },
    updateAd: (state, action: PayloadAction<Ad>) => {
      const index = state.ads.findIndex((ad) => ad.id === action.payload.id)
      if (index !== -1) {
        state.ads[index] = action.payload
      }
    },
    deleteAd: (state, action: PayloadAction<string>) => {
      state.ads = state.ads.filter((ad) => ad.id !== action.payload)
      state.userAds = state.userAds.filter((ad) => ad.id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<Partial<AdsState["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setAds, setFeaturedAds, setUserAds, addAd, updateAd, deleteAd, setFilters, setLoading, setError } =
  adsSlice.actions
export default adsSlice.reducer
