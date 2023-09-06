import { useState } from 'react'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { API_LIST } from './models/api'
import axios from 'axios'
import oauth from 'axios-oauth-client'
import './App.css'

const queryClient = new QueryClient();

const getClientCredentials = oauth.clientCredentials(
  axios.create(),
  '/translateApi/oauth2/token.php',
  import.meta.env.VITE_TRANSLATION_API_KEY,
  import.meta.env.VITE_TRANSLATION_API_SECRET_KEY,
);

const auth = await getClientCredentials();

function App() {
  const [text, setText] = useState('');
  const [responses, setResponses] = useState<string[]>([]);

  const changedText = (e:React.ChangeEvent<HTMLInputElement>):void => {
    setText(e.target.value);
  }

  const submitChat = async(message:string) => {
    try {
      if(message === ''){return}
      const res = await axios.post(API_LIST.CHAT.url, {
        api_key: import.meta.env.VITE_CHAT_API_KEY,
        agent_id: import.meta.env.VITE_CHAT_AGENT_ID,
        utterance: message
      });
      const {data} = res;
      const resMessage = data.bestResponse.utterance;
      setResponses([...responses, resMessage]);
      // NOTE: 入力文字を初期化
      setText('');
    } catch(e) {
      console.log('error')
    }
  }

  const translateToJa = async(text:string):string => {
    const params = {
        access_token: auth.access_token,
        key: import.meta.env.VITE_TRANSLATION_API_KEY,
        name: import.meta.env.VITE_TRANSLATION_USER_ID,
        type: 'json',
        text,
    }

    const searchParams = new URLSearchParams();
    for (let key in params) {
      searchParams.append(key, params[key]);
    }

    const res = await axios.post(API_LIST.EN_TO_JA.url, searchParams);
    const answer:string = res.data.resultset.result.text;
    return answer;
  }

  const postChat = async() => {
    // await submitChat(text);
    const answer = await translateToJa(text);
    console.log(answer);
    if(answer){
      await submitChat(answer);
    }
  }

  const stateDisabled = ():boolean => {
    if(text === ''){
      return true
    }else {
      return false
    }
  }

  // const query = useQuery({
  //   queryKey:['toEn'],
  //   queryFn: () => postChat(),
  // })

  // const mutation = useMutation({
  //   mutationFn: postChat,
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries({ queryKey: ['toEn'] })
  //   },
  // })

  const ChatList = () => {
    const list = responses.map(response => {
      return (
        <li key={response}>{response}</li>
      );
    });
    return <ul>{list}</ul>
  };

  return (
    <>
      <h1>英語勉強用</h1>
      <form >
        <input type="text" onChange={changedText} value={text} />
        <button type="button" onClick={() => postChat()} disabled={stateDisabled()}>送信</button>
      </form>
      <div>
        <ChatList />
      </div>
    </>
  )
}

export default App
