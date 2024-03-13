import { useEffect, useRef, useState } from 'react';
import ChatRoom, { ChatRoomInfo } from './ChatRoom';
import { io, Socket } from 'socket.io-client';
import { useUserInfo } from './UserInfoContext';

export interface NamespaceType {
  id: string;
  host: string;
  namespace: string;
  port: number;
}

interface NameSpaceProps extends NamespaceType {
  closeNamespace: () => void;
  onUpdate(updateNamespace: NamespaceType): void;
}

const NameSpace = ({
  id,
  host: initialHost,
  namespace: initialNamespace,
  port: initialPort,
  closeNamespace,
  onUpdate,
}: NameSpaceProps) => {
  const { setUserId: setUserIdInfo } = useUserInfo();
  const [userId, setUserId] = useState('');
  const [permission, setPermission] = useState('user');
  const logTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const prefix = 'room';
  const [socket, setSocket] = useState<Socket | null>(null);
  const [host, setHost] = useState(initialHost);
  const [namespace, setNamespace] = useState(initialNamespace);
  const [port, setPort] = useState(initialPort);
  const [rooms, setRooms] = useState<string[]>([`${prefix}1`]);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [statusInfo, setStatusInfo] = useState<string>(
    'Disconnect[Socket ID][👤userId]'
  );

  const log = (message: string) => {
    setLogMessages((prevLogMessages) => [...prevLogMessages, message]);
  };

  const connectHandler = () => {
    const url = `http://${host}:${port}${namespace}`;

    const auth = {
      userId: userId.length === 0 ? 'guest' : userId,
      permission,
    };
    const newSocket = io(url, { auth });
    if (newSocket) {
      setSocket(newSocket);
    }
  };
  const disconnectHandler = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };
  const joinRoomHandler = (room: string) => {
    socket && socket.emit('joinRoom', room);
  };

  useEffect(() => {
    if (socket) {
      console.log('🚀 | NameSpace | useEffect | socket:', socket);
      console.log('🚀 | NameSpace | useEffect | socket-id:', socket.id);
      socket.on('connect', () => {
        log(`[🟢 connect] ${socket.id}`);
        setStatusInfo(`🟢 Connect[${socket.id}][👤${userId}]`);
        setUserIdInfo(userId);
        socket.emit('roomList', (roomList: any) => {
          console.log(`roomList: ${JSON.stringify(roomList)}`);
        });
      });
      socket.on('connectionComplete', (info) => {
        // connect 이벤트 서버에 전송되면 서버에서 이전 대화방에 join 후에 connectionComplete 이벤트를 전송합니다.
        setUserIdInfo(info.userId);
        setStatusInfo(`🟢 Connect[${socket.id}][👤${info.userId}]`);
      });
      socket.on('disconnect', (msg) => {
        log(`[🟤 disconnect] ${msg}`);
        setStatusInfo(' Disconnect[Socket ID]');
      });
      socket.on('error', (error) => {
        log(`[🔴 error] ${error}`);
      });
      socket.on('connect_error', (error) => {
        log(`[🟠 connect_error] ${error.message}`); // 'Invalid socket'
      });
      socket.on('join-room', (roomName) => {
        log(`join room: ${roomName}`);
      });
      socket.on('chatroomList', (chatroomList) => {
        log(`chatroomList: ${JSON.stringify(chatroomList, null, 2)}`);
      });
    }
    return () => {
      socket && socket.disconnect();
    };
  }, [socket]);

  const hostInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHost(event.target.value);
  };

  const namespaceInputHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNamespace(event.target.value);
  };
  const portInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(Number(event.target.value));
  };
  const userIdChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value) {
      setUserId(value);
    }
  };

  const closeNamespaceHandler = () => {
    closeNamespace();
  };
  const addRoomHandler = () => {
    setRooms((prevRooms) => [...prevRooms, prefix + (prevRooms.length + 1)]);
  };
  const removeRoomHandler = (index: number) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms.splice(index, 1);
      return updatedRooms;
    });
  };

  useEffect(() => {
    onUpdate({ id, host, namespace, port });
  }, [id, host, namespace, port]); // FIXME: onUpdate를 종속성에 추가하면 무한 루프가 발생합니다.

  const updateChatrooms = (index: number, updateChatroom: ChatRoomInfo) => {
    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      updatedRooms[index] = updateChatroom.roomName;
      return updatedRooms;
    });
  };

  useEffect(() => {
    console.log('🚀 | NameSpace | useEffect | rooms:', rooms);
  }, [rooms]);

  useEffect(() => {
    if (logTextareaRef.current) {
      logTextareaRef.current.scrollTop = logTextareaRef.current.scrollHeight;
    }
  }, [logMessages]);

  return (
    <div
      id='namespaces'
      className='border-2 border-black border-solid p-2 m-2 bg-stone-200'
    >
      <header className='flex justify-between mb-1'>
        <h2>Namespaces</h2>
        <h2 id='status'>{statusInfo}</h2>
        <button id='namespacesclose' onClick={closeNamespaceHandler}>
          Close
        </button>
      </header>
      <div>
        <div className='flex justify-end'>
          <input
            type='text'
            id='host'
            placeholder='Host'
            value={host}
            className='min-w-12'
            onChange={hostInputHandler}
          />
          <input
            type='text'
            id='port'
            placeholder='Port'
            value={port}
            className='min-w-12'
            onChange={portInputHandler}
          />
          <select value={namespace} onChange={namespaceInputHandler}>
            <option value='/'>/</option>
            <option value='/user'>user</option>
            <option value='/admin'>admin</option>
          </select>
          <select
            onChange={(e) => {
              setPermission(e.target.value);
            }}
          >
            <option value='user' selected>
              user 권한
            </option>
            <option value='admin'>admin 권한</option>
          </select>
          <input
            type='text'
            placeholder='userid'
            value={userId}
            className='min-w-12'
            onChange={userIdChangeHandler}
          />
          <button className='ml-1' onClick={connectHandler}>
            Connect
          </button>
          <button className='ml-1' onClick={disconnectHandler}>
            Disconnect
          </button>
        </div>
        <textarea
          ref={logTextareaRef}
          value={logMessages.join('\n')}
          className='w-full mt-1 text-sm'
          rows={3}
          cols={50}
          readOnly
        ></textarea>
      </div>
      <div id='chatarea-inside'>
        <div id='chatarea'>
          {rooms.map((room, index) => {
            return (
              <ChatRoom
                socket={socket}
                key={index}
                chatRoomName={room}
                closeRoom={() => removeRoomHandler(Number(index))}
                updateChatRoom={(updateChatroom) =>
                  updateChatrooms(index, updateChatroom)
                }
              />
            );
          })}
        </div>
        <div className='flex justify-end'>
          <button id='roomadd' onClick={addRoomHandler}>
            Add Room
          </button>
        </div>
      </div>
    </div>
  );
};
export default NameSpace;
