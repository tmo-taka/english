import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StyleProvider } from '@ant-design/cssinjs';
import { PostProvider } from './contexts/postContext'
import { ChatProvider } from './contexts/chatContext'
import { EnChatProvider } from './contexts/enChatContext'
import './assets/css/overwrite.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyleProvider hashPriority="high">
        <PostProvider>
          <ChatProvider>
            <EnChatProvider>
              <App />
            </EnChatProvider>
          </ChatProvider>
        </PostProvider>
      </StyleProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </React.StrictMode>,
)
