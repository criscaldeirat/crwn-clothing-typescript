import { compose, createStore, applyMiddleware, Middleware } from "redux";
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import { thunk } from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
// import logger from "redux-logger"; // I could use logger, but I prefer to use my own middleware for now

import { rootSaga } from './root-saga';
import { rootReducer } from "./root-reducer";
import { loggerMiddleware } from './middleware/logger';


export type RootState = ReturnType<typeof rootReducer> // need to use typeof to get the different types inside rootReducer, otherwhise we would get any

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

type ExtendedPersistConfig = PersistConfig<RootState> & {
    whitelist: (keyof RootState)[]
}

const persistConfig: ExtendedPersistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart'],
}

const sagaMiddleware = createSagaMiddleware();

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleWares = [
    process.env.NODE_ENV !== 'development' && loggerMiddleware,
    sagaMiddleware,
].filter((middleware): middleware is Middleware => Boolean(middleware)); // we can't have just filter(boolean) because TS doesnt process it the way we need it, so we add a way to verify if it is passing a middleware and verifying by a boolean

//to use the redux tools chrome extension 
const composeEnhancer = (
    process.env.NODE_ENV !== 'production' 
    && window 
    && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || 
    compose;

const composedEnhancers = composeEnhancer(applyMiddleware(...middleWares));


// root-reducer
export const store = createStore(persistedReducer, undefined, composedEnhancers);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);