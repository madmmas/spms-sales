import React, { Suspense } from "react";

import RequireAuth from "./RequireAuth";
import Fallback from "../layout/Fallback";

const RouteAuth  = ({ pageComponent }) => {

    return (
        <RequireAuth>
            <Suspense fallback={<Fallback />}>
                {pageComponent}
            </Suspense>
        </RequireAuth>
    );
}

export default RouteAuth;