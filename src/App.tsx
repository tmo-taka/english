import { useState } from 'react'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { API_LIST } from './models/api'
import axios from 'axios'
import oauth from 'axios-oauth-client'
import { Button, Input, Card, Form, Collapse} from 'antd';
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
  const [enResponses, setEnResponses] = useState<string[]>([]);

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

  const postChat = async() => {
    // await submitChat(text);
    const answer = await translateToJa(text);
    let jaResponse = undefined
    if(answer){
      jaResponse = await submitChat(answer);
    }
    const res_en:string = await translateToEn(jaResponse);
    setEnResponses([...enResponses, res_en]);
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
    const list = responses.map((response,index) => {
      return (
        <Card title={response} style={{ width: 500 }}>
          <Form.Item<FieldType>
            label="英語に訳してみましょう！"
            name="translateToEnglish"
          >
            <Input/>
            <Button type="primary" htmlType="submit">
              確認
            </Button>
          </Form.Item>
          <Collapse
            items={[{ key: index, label: '回答をみる', children: <p>{enResponses[index]}</p> }]}
          />
        </Card>
      );
    });
    return <ul>{list}</ul>
  };

  return (
    <>
      <h1>英語勉強用</h1>
      <Form style={{ maxWidth: 600 }}>
        <Input type="text" onChange={changedText} value={text} />
        <Button type="primary" onClick={() => postChat()} disabled={stateDisabled()}>送信</Button>
      </Form>
      <div>
        <ChatList />
      </div>
    </>
  )
}

export default App
