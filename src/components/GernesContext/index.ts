import React from 'react';
const GenresContext = React.createContext<{ [n: number]: string }>({});
export default GenresContext;
