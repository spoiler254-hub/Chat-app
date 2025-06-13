import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from './Auth';
import { Chat } from './Chat';

export function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="app">
      <h1>Simple Chat</h1>
      {user ? <Chat /> : <Auth />}
    </div>
  );
}
