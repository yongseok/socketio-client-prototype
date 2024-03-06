import { useCallback, useEffect, useState } from 'react';
import ChatArea, { ChatAreaType } from './ChatArea';
import { NamespaceType } from './App';

interface NameSpaceProps {
  id: string;
  host: string;
  namespace: string;
  port: number;
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
  const prefix = 'room';
  const [host, setHost] = useState(initialHost);
  const [namespace, setNamespace] = useState(initialNamespace);
  const [port, setPort] = useState(initialPort);
  const [rooms, setRooms] = useState<string[]>([`${prefix}1`]);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const log = (message: string) => {
    setLogMessages((prevLogMessages) => [...prevLogMessages, message]);
  };

  const hostInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHost(event.target.value);
  };

  const namespaceInputHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNamespace(event.target.value);
  };

  const portInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPort(Number(event.target.value));
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

  const updateChatrooms = (index: number, updateChatroom: ChatAreaType) => {
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
    const logTextarea = document.getElementById('logTextarea');
    if (logTextarea) {
      logTextarea.scrollTop = logTextarea.scrollHeight;
    }
  }, [logMessages]);

  return (
    <div
      id='namespaces'
      className='border-2 border-black border-solid p-2 m-2 bg-stone-200'
    >
      <header className='flex justify-between mb-1'>
        <h2>Namespaces</h2>
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
            id='namespace'
            placeholder='Namespace'
            value={namespace}
            className='min-w-12'
            onChange={namespaceInputHandler}
          />
          <input
            type='text'
            id='port'
            placeholder='Port'
            value={port}
            className='min-w-12'
            onChange={portInputHandler}
          />
          <button className='ml-1'>Connect</button>
          <button className='ml-1'>Disconnect</button>
        </div>
        <textarea
          id='logTextarea'
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
              <ChatArea
                key={index}
                roomName={room}
                closeRoom={() => removeRoomHandler(Number(index))}
                updateRoom={(updateChatroom) =>
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
