import { useState, useContext } from 'react'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { API_LIST } from './models/api'
import axios from 'axios'
import oauth from 'axios-oauth-client'
import { Row, Col } from 'antd';
import { MessageProvider } from './contexts/messageContext'
import { postContext } from './contexts/postContext'
import { chatContext } from './contexts/chatContext'
import { enChatContext } from './contexts/enChatContext'
import { InputMessage } from './components/InputMessage'
import { PostLists } from './components/PostLists'
import { ChatLists } from './components/ChatLists'
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
  const {chats, setChats} = useContext(chatContext);
  const {enChats, setEnChats} = useContext(enChatContext);
  const {posts, setPosts} = useContext(postContext);
  const [loading, setLoading] = useState<boolean>(false);

  const submitChat = async(message:string) => {
    try {
      setChats([...chats, '']);
      if(message === ''){return}
      const res = await axios.post(API_LIST.CHAT.url, {
        api_key: import.meta.env.VITE_CHAT_API_KEY,
        agent_id: import.meta.env.VITE_CHAT_AGENT_ID,
        utterance: message
      });
      const {data} = res;
      const resMessage = data.bestResponse.utterance;
      setChats([...chats, resMessage]);
      // NOTE: 入力文字を初期化
      // setText('');
      return resMessage;
    } catch(e) {
      console.log('error')
    }
  }

  const translateToJa = async(text:string):Promise<string> => {
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
    // const answer:string = res.data.resultset.result.text;
    const answer:string = res.data.resultset.result.text;
    return answer;
  }

  const translateToEn = async(text:string):Promise<string> => {
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

    const res = await axios.post(API_LIST.JA_TO_EN.url, searchParams);
    const answer:string = res.data.resultset.result.text;
    return answer;
  }

  const postChat = async(message:string) => {
    setLoading(true);
    setPosts([...posts, '']);
    // await submitChat(text);
    const answer = await translateToJa(message);
    setPosts([...posts, answer]); 
    let jaResponse = undefined
    if(answer){
      jaResponse = await submitChat(answer);
    }
    const res_en:string = await translateToEn(jaResponse);
    setEnChats([...enChats, res_en]);
    setLoading(false)
  }


  const MergeList = () => {
    const posts:JSX.Element[] = PostLists();
    const chats:JSX.Element[] = ChatLists();
    const lastIndex:number = chats.length > posts.length ? chats.length : posts.length;
    const newList:JSX.Element[] = [];

    for (let i = 0; i<lastIndex; i++){
      newList.push(posts[i]);
      newList.push(chats[i])
    }

    return (
      <Row gutter={[0, 24]}>
        {newList}
      </Row>
    )
  }

  return (
    <>
      <h1>英語勉強用</h1>
      <MessageProvider>
        <InputMessage onPost={(message:string)=>postChat(message)} loading={loading}/>
      </MessageProvider>
      <Row gutter={8}>
        <Col span={12}>
          <MergeList  />
        </Col>
      </Row>
    </>
  )
}

export default App
