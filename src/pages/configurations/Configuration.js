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
            dialogTitle={modelDef.dialogTitle}
            headerTitle={modelDef.headerTitle}
            createMsg={modelDef.createMsg}
            updateMsg={modelDef.updateMsg}
            deleteMsg={modelDef.deleteMsg}
            />
    )
}

export default Configuration;