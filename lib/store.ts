import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./features/auth/authSlice"
import adsSlice from "./features/ads/adsSlice"
import uiSlice from "./features/ui/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ads: adsSlice,
    ui: uiSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
