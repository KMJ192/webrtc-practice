import { useParam, useRedirection } from '@router';

function ChatRoom() {
  const { id } = useParam();
  return `
    <h1>chat room ${id}</h1>
  `;
}

export default ChatRoom;
