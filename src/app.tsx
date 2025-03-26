import { GrispiProvider } from "./contexts/grispi-context";
import { StoreProvider } from "./contexts/store-context";
import { ChatScreen } from "./screens/chat-screen";

const App = () => {
  return (
    <StoreProvider>
      <GrispiProvider>
        <ChatScreen />
      </GrispiProvider>
    </StoreProvider>
  );
};

export default App;
