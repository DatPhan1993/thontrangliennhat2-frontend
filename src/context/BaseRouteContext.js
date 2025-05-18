import { createContext, useContext } from 'react';

const BaseRouteContext = createContext();

export const useBaseRoute = () => {
    return useContext(BaseRouteContext);
};

export const BaseRouteProvider = ({ children, baseRoute, categoryType }) => {
    return (
        <BaseRouteContext.Provider value={{ baseRoute, categoryType }}>
            {children}
        </BaseRouteContext.Provider>
    );
};

export default BaseRouteContext; 