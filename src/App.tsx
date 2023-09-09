import { useState } from 'react'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { API_LIST } from './models/api'
import axios from 'axios'
import oauth from 'axios-oauth-client'
import { Avatar, Button, Input, Card, Form, Collapse, Row, Col, ConfigProvider} from 'antd';
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
  const [posts, setPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const changedText = (e:React.ChangeEvent<HTMLInputElement>):void => {
    setText(e.target.value);
  }

  const submitChat = async(message:string) => {
    try {
      setResponses([...responses, '']);
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
    setLoading(true);
    setPosts([...posts, '']);
    // await submitChat(text);
    const answer = await translateToJa(text);
    setPosts([...posts, answer]);
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

  const postList = () => {
    const { Meta } = Card;
    const lists = posts.map((post,index) => {
        if(post !== '') {
            // NOTE: loading中でない
            return (<Col offset={0} span={20} key={post + index}>
              <ConfigProvider
                theme={{
                  token: {
                    colorBgContainer: '#87d068'
                  }
                }}
              >
                <Card >
                    <Meta
                      avatar={<Avatar style={{ backgroundColor: '#F00' }} icon={<UserOutlined />} />}
                      title={post}
                      style={{textAlign: 'left', whiteSpace: 'normal'}}
                    />
                </Card>
              </ConfigProvider>
            </Col>
          )
        } else {
          // NOTE: loading中
          return (
            <Col offset={0} span={20} key={post + index}>
              <ConfigProvider
                theme={{
                  token: {
                    colorBgContainer: '#87d068'
                  }
                }}
              >
                <Card loading={true} />
              </ConfigProvider>
            </Col>
          )
        }
    })
    return lists
  }

  const chatList = () => {
    const { Meta } = Card;
    const { TextArea } = Input;
    const lists = responses.map((response,index) => {
      if(response !== '') {
        // NOTE: loading中でない
        return (
          <Col offset={24} span={20} key={response + index}>
            <Card >
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
                  <Row align='bottom'>
                    <Col flex={5}>
                      <TextArea />
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
          </Col>
        );
      } else {
        return (
          <Col offset={24} span={20} key={response + index}>
            <Card loading={true} />
          </Col>
        )
      }
    });
    return lists
  };

  const MergetList = () => {
    const posts:JSX.Element[] = postList();
    const chats:JSX.Element[] = chatList();
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
      <Form size="large" style={{ width: 800, margin: '0 auto 24px' }}>
        <Row justify="space-between">
          <Col span={21}>
            <Input type="text" onChange={changedText} value={text} />
          </Col>
          <Col span={3}>
            <Button type="primary" onClick={() => postChat()} disabled={stateDisabled()} loading={loading}>送信</Button>
          </Col>
        </Row>
      </Form>
      <Row gutter={8}>

        <Col span={12}>
          <MergetList  />
        </Col>
      </Row>
    </>
  )
}

export default App
