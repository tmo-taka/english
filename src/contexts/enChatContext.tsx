import { createContext, Dispatch, useState} from 'react'

type EnChatsState = {
    enChats: string[],
    setEnChats: Dispatch<SetStateAction<string[]>>;
}

export const enChatContext = createContext<EnChatsState>({
    enChats: [],
    setEnChats: (newChats:string[]) => [...newChats],
});

export const EnChatProvider = ({children}) => {
    const [enChats,setEnChats] = useState<string[]>([]);
    return (
        <enChatContext.Provider value={{enChats,setEnChats}}>
            {children}
        </enChatContext.Provider>
    )
}