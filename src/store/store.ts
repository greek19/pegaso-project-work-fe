import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../services/authApi';
import { accountApi } from '../services/accountApi';
import {tipologicheApi} from "../services/tipologicheApi.ts";
import {polizzeApi} from "../services/polizzeApi.ts";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [tipologicheApi.reducerPath]: tipologicheApi.reducer,
    [polizzeApi.reducerPath]: polizzeApi.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
            .concat(authApi.middleware)
            .concat(accountApi.middleware)
            .concat(tipologicheApi.middleware)
            .concat(polizzeApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
