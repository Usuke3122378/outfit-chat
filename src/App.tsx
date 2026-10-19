import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import ConditionsForm, { type Conditions } from '@/components/ConditionsForm';
import ChatMessage, { type Message } from '@/components/ChatMessage';
import TypingIndicator from '@/components/TypingIndicator';
import ChatInput from '@/components/ChatInput';
import SuggestedQuestions from '@/components/SuggestedQuestions';
import { sendMessage, type ChatInputs } from '@/api/chat';

const GREETING =
  'おはようございます！今日のコーデを一緒に考えます👕\n\n地域と予定を入れて『今日のコーデを教えて』と送ってください。';

const INITIAL_CONDITIONS: Conditions = {
  region: '',
  scene: 'work',
  mood: '',
};

function makeId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function App() {
  const [conditions, setConditions] = useState<Conditions>(INITIAL_CONDITIONS);
  const [messages, setMessages] = useState<Message[]>([
    { id: makeId(), role: 'bot', content: GREETING },
  ]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!conditions.region.trim()) {
        setWarning('地域を入力してください（条件入力エリアにあります）');
        return;
      }
      setWarning(null);

      const userMsg: Message = { id: makeId(), role: 'user', content: text };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      const inputs: ChatInputs = {
        region: conditions.region.trim(),
        scene: conditions.scene,
        mood: conditions.mood.trim() || undefined,
      };

      try {
        const res = await sendMessage({
          query: text,
          inputs,
          conversationId,
        });
        setConversationId(res.conversationId);
        setMessages((prev) => [
          ...prev,
          { id: makeId(), role: 'bot', content: res.answer },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: 'bot',
            content: 'すみません、エラーが発生しました。もう一度お試しください。',
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [conditions, conversationId],
  );

  const handleReset = () => {
    setMessages([{ id: makeId(), role: 'bot', content: GREETING }]);
    setConversationId(undefined);
    setWarning(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-stone-50">
      <Header />

      <div className="px-3 pt-3">
        <ConditionsForm values={conditions} onChange={setConditions} />
      </div>

      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          チャット
        </h2>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-stone-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          新しい会話
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-3"
      >
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      <SuggestedQuestions onSelect={handleSend} disabled={loading} />
      <ChatInput onSend={handleSend} disabled={loading} warning={warning} />
    </div>
  );
}

export default App;
