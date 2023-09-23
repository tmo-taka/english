import { createContext, Dispatch, useState} from 'react'

type PostsState = {
    posts: string[],
    setPosts: Dispatch<SetStateAction<string[]>>;
}

export const postContext = createContext<PostsState>({
    posts: [],
    setPosts: (newPosts:string[]) => [...newPosts],
});

export const PostProvider = ({children}) => {
    const [posts,setPosts] = useState<string[]>([]);
    return (
        <postContext.Provider value={{posts,setPosts}}>
            {children}
        </postContext.Provider>
    )
}