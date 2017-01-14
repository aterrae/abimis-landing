import React from 'react';
import { Route, IndexRoute } from 'react-router';

import ContainerName from './containers/ContainerName';

export default function getRoutes(store) {
    return (
        <Route path="/">
            <IndexRoute component={ContainerName} />
            <Route path="pathName" component={ContainerName} />
        </Route>
    )
}
