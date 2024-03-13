import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useUserInfo } from './UserInfoContext';

type MessageType = 'text' | 'image' | 'video' | 'file' | 'system';

type Message = {
  roomName: string;
  userId: string;
  type: MessageType;
  content: string;
};

export type ChatRoomInfo = {
  roomName: string;
};

type ChatRoomProps = {
  socket: Socket | null;
  chatRoomName: string;
  closeRoom: () => void;
  updateChatRoom: (updatedRoom: ChatRoomInfo) => void;
};
const ChatRoom = ({
  socket,
  chatRoomName: initChatRoomName,
  closeRoom,
  updateChatRoom: updateRoom,
}: ChatRoomProps) => {
  const { userId } = useUserInfo();
  const [chatTextarea, setChatTextarea] = useState('');
  const [inputChatRoomName, setInputChatRoomName] = useState('');
  const [requestChatRoomName, setRequestChatRoomName] = useState('');
  const [joinedRoomChatName, setJoinedRoomChatName] = useState<string>('');
  const [message, setMessage] = useState('');
  const chattextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setInputChatRoomName(initChatRoomName);
  }, [initChatRoomName]);

  const changeNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputChatRoomName(event.target.value);
    updateRoomHandler(event.target.value);
  };

  const closeHandler = () => {
    console.log('🚀 | closeHandler | closeRoom:', closeRoom);
    closeRoom();
  };

  const updateRoomHandler = (chatRoomName: string) => {
    updateRoom({ roomName: chatRoomName });
  };

  const formattedMessage = useCallback(
    (messageObject: Message) => {
      const date = new Date();
      const isMe = userId === messageObject.userId;
      console.log('🚀 | formattedMessage | userId:', userId);
      const sendInfo =
        messageObject.type === 'system'
          ? '[system]'
          : isMe
          ? ''
          : `[${messageObject.userId} ]`;
      return `[${date.toISOString()}] ${sendInfo} ${messageObject.content}`;
    },
    [userId]
  );

  const sendHandler = () => {
    if (socket) {
      const msgObject: Message = {
        roomName: '',
        userId,
        type: 'text',
        content: message,
      };
      setChatTextarea(
        (prevChatTextarea) =>
          prevChatTextarea + '\n' + formattedMessage(msgObject)
      );
      socket.emit('message', inputChatRoomName, msgObject);
    }
  };

  const joinHandler = () => {
    console.log('🚀 | joinHandler | inputChatRoomName:', inputChatRoomName);
    setRequestChatRoomName(inputChatRoomName);
  };

  const leaveHandler = () => {
    if (socket) {
      socket.emit('leaveRoom', inputChatRoomName);
    }
  };

  useEffect(() => {
    if (socket) {
      const messageListener = (messageObject: Message) => {
        if (messageObject.roomName === joinedRoomChatName) {
          setChatTextarea(
            (prevChatTextarea) =>
              prevChatTextarea + '\n' + formattedMessage(messageObject)
          );
        }
      };

      const joinRoomListener = (chatRoomName: string) => {
        if (chatRoomName === requestChatRoomName) {
          setJoinedRoomChatName(chatRoomName);
        }
      };

      socket.on('message', messageListener);
      socket.on('join-room', joinRoomListener);

      // 클린업 함수에서 이벤트 리스너를 제거합니다.
      return () => {
        socket.off('message', messageListener);
        socket.off('join-room', joinRoomListener);
      };
    }
  }, [
    socket,
    requestChatRoomName,
    joinedRoomChatName,
    setChatTextarea,
    userId,
    formattedMessage,
  ]);

  useEffect(() => {
    if (socket && requestChatRoomName.length > 0) {
      socket.emit('joinRoom', requestChatRoomName);
    }
  }, [socket, requestChatRoomName]);

  useEffect(() => {
    if (chattextareaRef) {
      if (chattextareaRef.current) {
        chattextareaRef.current.scrollTop =
          chattextareaRef.current.scrollHeight;
      }
    }
  }, [chatTextarea]);

  return (
    <div
      id='chatarea'
      className='border-2 border-black border-solid p-2 m-2 bg-slate-200'
    >
      <header className='flex justify-between mb-1'>
        <h3>Chat Room</h3>
        <button id='chatclose' onClick={closeHandler}>
          Close
        </button>
      </header>
      <div className='flex'>
        <input
          type='text'
          className='grow'
          placeholder='roomname'
          value={inputChatRoomName}
          onChange={changeNameHandler}
        />
        <button className='ml-1' onClick={joinHandler}>
          Join
        </button>
        <button className='ml-1' onClick={leaveHandler}>
          Leave
        </button>
      </div>
      <div id='roomarea'>
        <textarea
          ref={chattextareaRef}
          id='chattextarea'
          className='w-full mt-1 text-sm'
          rows={3}
          cols={50}
          readOnly
          value={chatTextarea}
        ></textarea>
        <div className='flex'>
          <input
            className='grow'
            type='text'
            id='message'
            placeholder='message'
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            className='flex shrink-0 ml-1'
            id='send'
            onClick={sendHandler}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatRoom;
