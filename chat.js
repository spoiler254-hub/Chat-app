import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      userId: auth.currentUser.uid,
      timestamp: serverTimestamp()
    });
    
    setNewMessage('');
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.userId === auth.currentUser?.uid ? 'sent' : 'received'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
