import { createContext, Dispatch, useState} from 'react'

type ChatsState = {
    chats: string[],
    setChats: Dispatch<SetStateAction<string[]>>;
}

export const chatContext = createContext<ChatsState>({
    chats: [],
    setChats: (newChats:string[]) => [...newChats],
});

export const ChatProvider = ({children}) => {
    const [chats,setChats] = useState<string[]>([]);
    return (
        <chatContext.Provider value={{chats,setChats}}>
            {children}
        </chatContext.Provider>
    )
}