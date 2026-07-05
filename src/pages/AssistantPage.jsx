import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { getChatHistory, sendChatMessage } from "../lib/services/chatService";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { apiErrorMessage } from "../lib/api";
import { cn } from "../lib/utils";

export default function AssistantPage() {
  const [turns, setTurns] = useState([]); // { role: 'user' | 'assistant', text }
  const [message, setMessage] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    getChatHistory()
      .then((history) => {
        const flattened = history.flatMap((h) => [
          { role: "user", text: h.message },
          { role: "assistant", text: h.response },
        ]);
        setTurns(flattened);
      })
      .finally(() => setIsLoadingHistory(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, isSending]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || isSending) return;

    setTurns((t) => [...t, { role: "user", text }]);
    setMessage("");
    setError("");
    setIsSending(true);
    try {
      const { reply } = await sendChatMessage(text);
      setTurns((t) => [...t, { role: "assistant", text: reply }]);
    } catch (err) {
      setError(apiErrorMessage(err, "The assistant couldn't reply right now."));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-72px)] max-w-2xl flex-col px-6 py-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-saffron-500 text-cream-50">
          <Sparkles className="size-5" />
        </span>
        <div>
          <h1 className="font-semibold text-ink-900 dark:text-cream-50">KhanayWala Assistant</h1>
          <p className="text-sm text-ink-500 dark:text-ink-200">Poochein kya khaayen aaj?</p>
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {isLoadingHistory && <Spinner label="Loading conversation" />}

          {!isLoadingHistory && turns.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-400">
              Kuch bhi poochein — "aaj kya spicy suggest karein?" ya "kam budget mein kya milega?"
            </p>
          )}

          {turns.map((turn, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                turn.role === "user"
                  ? "ml-auto bg-saffron-500 text-cream-50"
                  : "bg-ink-900/5 text-ink-800 dark:bg-cream-100/10 dark:text-cream-100"
              )}
            >
              {turn.text}
            </div>
          ))}

          {isSending && (
            <div className="max-w-[80%] rounded-2xl bg-ink-900/5 px-4 py-2.5 text-sm text-ink-400 dark:bg-cream-100/10">
              Typing...
            </div>
          )}
        </div>

        {error && <p className="px-5 pb-2 text-sm font-medium text-paprika-500">{error}</p>}

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-ink-900/8 p-3 dark:border-cream-100/10">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message KhanayWala Assistant..."
            className="flex-1 rounded-2xl bg-ink-900/5 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none dark:bg-cream-100/10 dark:text-cream-50"
          />
          <Button type="submit" size="sm" loading={isSending} disabled={!message.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </Card>
    </div>
  );
}
