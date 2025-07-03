import { createContext, useContext, useState } from "react";

export const UserContext = createContext(null);

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserAuth must be used within a UserContextProvider");
    }
    return context;
}