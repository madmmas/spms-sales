import React, { useEffect, useState } from 'react';

import CRUD from "../components/config_data/CRUD";
import { getModelDef } from "./ModelUIConf";

const Configuration = ({ modelName }) => {

    const [modelDef, setModelDef] = useState({});

    useEffect(() => {
        let def = getModelDef(modelName);
        setModelDef(def);
    }, [modelName]);

    return (
        <CRUD 
            modelName={modelName} 
            headerTitle={modelDef.headerTitle}
            />
    )
}

export default Configuration;