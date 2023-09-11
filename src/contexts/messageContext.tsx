import { createContext, Dispatch, useState} from 'react'

type MessageState = {
    message: string,
    setMessage: Dispatch<SetStateAction<string>>;
}

export const messageContext = createContext<MessageState>({
    message: '',
    setMessage: (newMessage:string) => newMessage,
});

export const MessageProvider = ({children}) => {
    const [message,setMessage] = useState<string>('');
    return (
        <messageContext.Provider value={{message,setMessage}}>
            {children}
        </messageContext.Provider>
    )
}