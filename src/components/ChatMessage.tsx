import ReactMarkdown from 'react-markdown';

export type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
};

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'bg-amber-500 text-white rounded-br-sm'
            : 'bg-white text-stone-800 border border-stone-200 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-stone-800 prose-headings:mt-2 prose-headings:mb-1 prose-h3:text-base prose-ul:my-1 prose-li:my-0.5 prose-strong:text-stone-900 prose-blockquote:border-amber-300 prose-blockquote:text-stone-600">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
