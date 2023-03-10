// import getConfig from 'next/config';
// import React, { useContext } from 'react';
// import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    // const { layoutConfig } = useContext(LayoutContext);
    // const contextPath = "/";//getConfig().publicRuntimeConfig.contextPath;

    return (
        <div className="layout-footer">
            Developed by
            <span className="font-medium ml-2">Nitto-Digital</span>
        </div>
    );
};

export default AppFooter;
