import React, { useCallback, useEffect } from 'react';
// import './App.css';
import { useState } from 'react';
import NameSpace from './NameSpace';

export const getUuid = (): string => {
  return Math.random().toString(36).substring(7);
};

export type NamespaceType = {
  id: string;
  host: string;
  namespace: string;
  port: number;
};

function App() {
  const [namespaces, setNamespaces] = useState<NamespaceType[]>([
    {
      id: getUuid(),
      host: 'localhost',
      namespace: '/',
      port: 3000,
    },
  ]);

  const addNamespaceHandler = () => {
    setNamespaces((prevNamespaces) => [
      ...prevNamespaces,
      {
        id: getUuid(),
        host: 'localhost',
        namespace: '/',
        port: 3000,
      },
    ]);
  };
  const closeNamespace = (uuid: string) => {
    setNamespaces((prevNamespaces) => {
      const updatedNamespaces = prevNamespaces.filter(
        (namespace) => namespace.id !== uuid
      );
      return updatedNamespaces;
    });
  };

  useEffect(() => {
    console.log('🚀 | App | namespaces:', namespaces);
  }, [namespaces]);

  const updateNamespaceHandler = useCallback(
    (updatedNamespace: NamespaceType) => {
      setNamespaces((prevNamespaces) => {
        const index = prevNamespaces.findIndex(
          (namespace) => namespace.id === updatedNamespace.id
        );

        // 이전 namespace와 updatedNamespace가 동일한 경우 상태 업데이트를 건너뜀
        if (prevNamespaces[index] === updatedNamespace) {
          return prevNamespaces;
        }

        const updatedNamespaces = [...prevNamespaces];
        updatedNamespaces[index] = updatedNamespace;
        console.log(
          '🚀 | setNamespaces | updatedNamespaces:',
          updatedNamespaces
        );
        return updatedNamespaces;
      });
    },
    [setNamespaces]
  );

  return (
    <div className='App'>
      <h1 className='text-4xl font-bold text-center'>Socket.io Client</h1>
      <div>
        <div id='namespaces-outside'>
          {namespaces.map((namespace, index) => {
            return (
              <NameSpace
                key={namespace.id}
                id={namespace.id}
                host={namespace.host}
                namespace={namespace.namespace}
                port={namespace.port}
                closeNamespace={() => closeNamespace(namespace.id)}
                onUpdate={(updatedNamespace) =>
                  updateNamespaceHandler(updatedNamespace)
                }
              />
            );
          })}
          <div className='flex justify-end mb-2 mr-2'>
            <button onClick={addNamespaceHandler}>Add Namespace</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
