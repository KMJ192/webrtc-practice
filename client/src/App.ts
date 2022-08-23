import { useRouter } from '@router';

import MainPage from './MainPage';
import NotFound from './NotFound';
import ChatRoom from './ChatRoom';

import '../static/style.css';

function App() {
  return useRouter(MainPage, NotFound, [
    {
      element: ChatRoom,
      path: '/chat-room/:id',
      queryString: true,
    },
  ]);
}

export default App;
