import { useState } from 'react'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { API_LIST } from './models/api'
import './App.css'

const queryClient = new QueryClient()

function App() {
  const [text, setText] = useState('');

  const changedText = (e:React.ChangeEvent<HTMLInputElement>):void => {
    setText(e.target.value);
  }

  const postJaToEn = async() => {
    const data = await fetch(API_LIST.JA_TO_EN.url, {
      method: 'POST',
      body: JSON.stringify({
        key: import.meta.env.VITE_API_KEY,
        name: import.meta.env.VITE_USER_ID,
        text: 'japan',
      })
    })
    console.log(data)
    return data;
  }


  const query = useQuery({
    queryKey:['toEn'],
    queryFn: () => postJaToEn(),
  })

  const mutation = useMutation({
    mutationFn: postJaToEn,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['toEn'] })
    },
  })

  return (
    <>
      <h1>英語勉強用</h1>
      <form >
        <input type="text" onChange={changedText} value={text} />
        <button type="button" onClick={() => {mutation.mutate}}>翻訳</button>
      </form>
      <div>
        <div></div>
      </div>
    </>
  )
}

export default App
