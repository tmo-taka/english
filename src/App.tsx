import { useState } from 'react'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { API_LIST } from './models/api'
import axios from 'axios'
import oauth from 'axios-oauth-client'
import { Avatar, Button, Input, Card, Form, Collapse, Row, Col} from 'antd';
import { UserOutlined } from '@ant-design/icons';
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
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true)
    // await submitChat(text);
    const answer = await translateToJa(text);
    let jaResponse = undefined
    if(answer){
      jaResponse = await submitChat(answer);
    }
    const res_en:string = await translateToEn(jaResponse);
    setEnResponses([...enResponses, res_en]);
    setLoading(false)
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
    const { Meta } = Card;
    const list = responses.map((response,index) => {
      return (
        <Card style={{ width: 500}}>
          <Meta
            avatar={<Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />}
            title={response}
            style={{borderBottom: 'solid 1px #CCC', textAlign: 'left', whiteSpace: 'normal', marginBottom: 8}}
          />
          <Form layout='vertical'>
            <Form.Item<FieldType>
              label="上記を英語に訳してみましょう！"
              name="translateToEnglish"
            >
              <Row>
                <Col flex={5}>
                  <Input />
                </Col>
                <Col flex={1}>
                  <Button type="primary" htmlType="submit">
                    確認
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
          <Collapse
            style={{ textAlign: 'left'}}
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
        <Row>
          <Col flex={5}>
            <Input type="text" onChange={changedText} value={text} />
          </Col>
          <Col flex={1}>
            <Button type="primary" onClick={() => postChat()} disabled={stateDisabled()} loading={loading}>送信</Button>
          </Col>
        </Row>
      </Form>
      <div>
        <ChatList />
      </div>
    </>
  )
}

export default App
