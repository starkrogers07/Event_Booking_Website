import React from 'react';

export default React.createContext({    //Bypassing the data 
    token: null,
    userId: null,
    login: (token, userId, tokenExpiration) => {},
    logout: () => {}
});