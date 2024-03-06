import { useEffect, useState } from 'react';

export type ChatAreaType = {
  roomName: string;
};

type ChatAreaProps = {
  roomName: string;
  closeRoom: () => void;
  updateRoom: (updatedRoom: ChatAreaType) => void;
};
const ChatArea = ({
  roomName: initRoomname,
  closeRoom,
  updateRoom,
}: ChatAreaProps) => {
  const [chatTextarea, setChatTextarea] = useState('');
  const [roomName, setRoomName] = useState('');
  useEffect(() => {
    setRoomName(initRoomname);
  }, [initRoomname]);

  const changeNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
    updateRoomHandler(event.target.value);
  };

  const closeHandler = () => {
    console.log('🚀 | closeHandler | closeRoom:', closeRoom);
    closeRoom();
  };

  const updateRoomHandler = (roomName: string) => {
    updateRoom({ roomName });
  };

  const sendHandler = () => {
    const message = (document.getElementById('message') as HTMLInputElement)
      .value;
    setChatTextarea((prevChatTextarea) => prevChatTextarea + '\n' + message);
  };

  useEffect(() => {
    const textarea = document.getElementById('chattextarea');
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
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
          value={roomName}
          onChange={changeNameHandler}
        />
        <button className='ml-1'>Join</button>
        <button className='ml-1'>Leave</button>
      </div>
      <div id='roomarea'>
        <textarea
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
export default ChatArea;
