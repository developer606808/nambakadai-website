import { configureStore, type PreloadedState } from "@reduxjs/toolkit"
import authSlice from "./features/auth/authSlice"
import adsSlice from "./features/ads/adsSlice"
import uiSlice from "./features/ui/uiSlice"
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: authSlice,
  ads: adsSlice,
  ui: uiSlice,
})

export const makeStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']