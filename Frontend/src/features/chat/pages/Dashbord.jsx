import { useSelector } from "react-redux"
import { useEffect } from "react"
import { useChat } from "../hook/useChat"
import { useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

const Dashbord = () => {
  const chats = useSelector(state => state.chat.chats)
  const curentChatId = useSelector(state => state.chat.currentChatId)
  const [chatInput, setChatInput] = useState("")
  const messagesEndRef = useRef(null)

  const { initializeSocket, handleSendMessage, handleGetChats, handleOpenChat } = useChat()
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    initializeSocket()
    handleGetChats()
  }, [])

  const userName = user?.fullname || user?.name || user?.username || "Explorer"
  const userInitial = userName.charAt(0).toUpperCase()
  const currentMessages = chats[curentChatId]?.messages || []
  const recentChats = Object.values(chats).sort((firstChat, secondChat) => {
    const firstCreatedAt = new Date(firstChat.createdAt || 0).getTime()
    const secondCreatedAt = new Date(secondChat.createdAt || 0).getTime()

    return secondCreatedAt - firstCreatedAt
  })
  const isChatEmpty = currentMessages.length === 0

  const handleSubmitMessage = async (event) => {
    event.preventDefault()

    const trimmedMessage = chatInput.trim()

    if (!trimmedMessage) {
      return
    }

    setChatInput("")
    await handleSendMessage(trimmedMessage, curentChatId)
  }

  const handleSelectChat = (chatId) => {
    handleOpenChat(chatId)
    
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [curentChatId, currentMessages.length])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02080b] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(30,129,143,0.24),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(30,129,143,0.12),_transparent_30%)]" />

      <div className="relative flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-white/10 bg-black/25 backdrop-blur-xl lg:h-screen lg:w-[320px] lg:border-b-0 lg:border-r">
          <div className="flex h-full min-h-0 flex-col p-4 sm:p-5">
            <div className="mb-5 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#1a818e]/30 bg-[#081115]">
                <div className="h-5 w-5 rounded-full border-2 border-[#7ddae3]" />
                <div className="absolute h-2.5 w-2.5 rounded-full bg-[#1a818e]" />
              </div>
              <div>
                <p
                  className="text-[1.7rem] leading-none text-white"
                  style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}
                >
                  Askora
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#76d4df]">
                  AI search
                </p>
              </div>
            </div>

            <button
              type="button"
              className="mb-5 inline-flex items-center justify-center rounded-2xl bg-[#1a818e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#146a74]"
            >
              + New chat
            </button>

            <div className="mb-3 flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#76d4df]">
                Recent chats
              </p>
              <div className="scrollbar-minimal mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
                {recentChats.map((chat, index) => (
                  <button
                    key={chat.chatId || index}
                    type="button"
                    
                    onClick={() => {
                      handleSelectChat(chat.chatId)
                    }}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      chat.chatId === curentChatId || (!curentChatId && index === 0)
                        ? "border-[#1a818e]/40 bg-[#1a818e]/10 text-white"
                        : "border-transparent bg-white/0 text-slate-300 hover:border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="line-clamp-2 leading-6">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <span>{children}</span>,
                          strong: ({ children }) => (
                            <strong className="font-semibold text-white">{children}</strong>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-black/20 px-1 py-0.5 text-[#9be7ef]">
                              {children}
                            </code>
                          ),
                          ul: ({ children }) => <span>{children}</span>,
                          ol: ({ children }) => <span>{children}</span>,
                          li: ({ children }) => <span>{children}</span>,
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#76d4df] underline underline-offset-4"
                            >
                              {children}
                            </a>
                          )
                        }}
                      >
                        {chat.title}
                      </ReactMarkdown>
                    </div>
                  </button>
                ))}
              </div>
            </div>

         

            <div className="mt-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a818e]/20 text-sm font-semibold text-[#9be7ef]">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{userName}</p>
                <p className="truncate text-xs text-slate-400">
                  Ready to ask your next question
                </p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex flex-1 px-5 py-6 sm:px-8 lg:h-screen lg:px-12 lg:py-8">
          <div className="flex w-full max-w-5xl flex-1 flex-col overflow-hidden lg:mx-auto">
            {isChatEmpty && (
              <div className="mx-auto mt-10 max-w-3xl text-center">
                <span className="inline-flex rounded-full border border-[#1a818e]/30 bg-[#1a818e]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[#76d4df]">
                  Ask smarter
                </span>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  What do you want to explore today?
                </h1>
                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  Search the web, summarize ideas, and keep every conversation organized in a focused AI workspace.
                </p>
              </div>
            )}

            <div className="scrollbar-minimal mx-auto mt-4 flex min-h-0 max-h-[65vh] w-full max-w-4xl flex-1 flex-col overflow-y-auto pr-2 pb-6 lg:mt-8 lg:max-h-none">
              <div className="space-y-4">
                {currentMessages.map((message, index) => (
                  <div
                    key={message.id || `${message.role}-${index}-${message.content}`}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-2xl rounded-[26px] border px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.18)] ${
                        message.role === "user"
                          ? "border-[#1a818e]/30 bg-[#1a818e]/12 text-white"
                          : "border-white/10 bg-white/[0.04] text-slate-200"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.24em] ${
                          message.role === "user" ? "text-[#9be7ef]" : "text-slate-400"
                        }`}
                      >
                        {message.role === "user" ? "You" : "AI"}
                      </p>
                      <div className="mt-3 text-sm leading-7 sm:text-[15px]">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-3 list-disc space-y-2 pl-5 last:mb-0">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-3 list-decimal space-y-2 pl-5 last:mb-0">{children}</ol>
                            ),
                            li: ({ children }) => <li>{children}</li>,
                            strong: ({ children }) => (
                              <strong className="font-semibold text-white">{children}</strong>
                            ),
                            code: ({ inline, children }) =>
                              inline ? (
                                <code className="rounded bg-black/30 px-1.5 py-0.5 text-[#9be7ef]">
                                  {children}
                                </code>
                              ) : (
                                <code className="block overflow-x-auto rounded-2xl bg-black/30 p-4 text-[#9be7ef]">
                                  {children}
                                </code>
                              ),
                            pre: ({ children }) => <pre className="mb-3 last:mb-0">{children}</pre>,
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#76d4df] underline underline-offset-4"
                              >
                                {children}
                              </a>
                            )
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="mx-auto mt-6 w-full max-w-4xl rounded-[30px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <form
                onSubmit={handleSubmitMessage}
                className="flex min-h-[88px] items-center gap-3 rounded-[26px] border border-white/8 bg-[#11181b] px-4 py-3"
              >
                {/* <button
                  type="button"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-slate-300 transition hover:border-[#1a818e]/50 hover:text-white"
                >
                  +
                </button> */}

                <div className="flex-1">
                 
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}

                    placeholder="Ask anything..."
                    className="mt-1 w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#1a818e] px-5 text-sm font-semibold text-white transition hover:bg-[#146a74]"
                >
                  Send
                </button>
              </form>
            </div>

            
          </div>
        </section>
      </div>
    </main>
  )
}

export default Dashbord
