"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../../types/supabase";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/context/userContext";
import moment from "moment";
import { Avatar, Button, Label, Spinner, TextInput, Textarea } from "flowbite-react";
import { IoMdSend } from "react-icons/io";
import { HiPlus, HiSearch } from "react-icons/hi";
type User = Database["public"]["Tables"]["profiles"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"] & { sent_by_user: User };
type Conversations = Database["public"]["Tables"]["conversation_users"]["Row"] & {
  conversations: { conversation_users: { user: User }[]; messages: Message[] };
};

export default function Inbox() {
  const supabase = createClientComponentClient<Database>();
  const { user, organization, allOrganizations } = useContext(UserContext);
  const [conversations, setConversations] = useState<Conversations[]>();
  const [selectedConversation, setSelectedConversation] = useState<number>();
  const [messages, setMessages] = useState<Message[]>();
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      getMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime events")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation=eq.${selectedConversation}`,
        },
        (payload) => {
          getMessages();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, selectedConversation]);

  async function getConversations() {
    let { data: conversations, error } = await supabase
      .from("conversation_users")
      .select("*, conversations!inner(id, messages(*), conversation_users(id, user(*)))")
      .eq("user", user?.id || "")
      //   .neq("conversations.conversation_users.user", user?.id)
      .limit(1, { foreignTable: "conversations.messages" })
      .order("created_at", {
        foreignTable: "conversations.messages",
        ascending: false,
      })
      .returns<Conversations[]>();

    if (conversations) {
      // Remove current user from conversation list so they don't see themselves
      const filteredConversations = conversations.map((item) => ({
        ...item,
        conversations: {
          ...item.conversations,
          conversation_users: item.conversations.conversation_users.filter((user) => user.user.id !== "9443835d-590d-41bb-b39f-c4ef028dd6a0"),
        },
      }));

      setConversations(filteredConversations);
    }
  }

  function MessageInput() {
    const [messageInput, setMessageInput] = useState<string>();
    async function handleSendMessage() {
      const { data, error } = await supabase
        .from("messages")
        .insert({ sent_by_user: user?.id, text: messageInput, conversation: selectedConversation })
        .select();

      if (data) {
        setMessageInput("");
      }
    }

    return (
      <div>
        <Textarea
          rows={4}
          placeholder="Type your message here..."
          onChange={(e) => setMessageInput(e.target.value)}
          value={messageInput}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              handleSendMessage();
            }
          }}
          className="max-h-36"
          disabled={!selectedConversation}
        />
        <div className="mt-2 flex justify-end">
          <Button onClick={handleSendMessage}>
            Send
            <IoMdSend className="ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  async function getMessages() {
    setIsMessagesLoading(true);
    let { data: messages, error } = await supabase
      .from("messages")
      .select("*, sent_by_user(*)")
      .eq("conversation", String(selectedConversation))
      .order("created_at", {
        ascending: false,
      })
      .returns<Message[]>();
    if (messages) {
      setMessages(messages);
    }
    setIsMessagesLoading(false);
  }

  return (
    <div className="flex flex-row h-full flex-1">
      <div className="flex flex-row min-w-[350px] flex-1">
        <div className="flex flex-col w-full h-full py-4 ">
          <div className="flex flex-col items-start p-4">
            <div className="flex w-full flex-row justify-between items-center mb-4">
              <h5 className="text-4xl font-bold text-gray-900 dark:text-white">Messages</h5>
              {/* <div className="flex items-center justify-center ml-2 text-xs h-5 w-5 text-white bg-red-500 rounded-full font-medium">5</div> */}
              <HiPlus size={20} className=" cursor-pointer" />
            </div>
            <TextInput className="w-full" placeholder="Search" rightIcon={HiSearch} />
          </div>

          <div className="mt-2">
            <div className="flex flex-col">
              {conversations &&
                conversations.map((convo) => (
                  <div
                    className="relative flex flex-row items-center p-4 cursor-pointer hover:text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 dark:hover:text-white dark:text-white dark:hover:bg-gray-700"
                    onClick={() => setSelectedConversation(convo.id)}
                    key={convo.id}
                  >
                    <div className="absolute text-xs text-gray-500 right-3 top-0  mt-3">
                      {moment(convo.conversations.messages[0].created_at).fromNow()}
                    </div>
                    <Avatar
                      alt={`${convo.conversations.conversation_users[0].user.first_name} ${convo.conversations.conversation_users[0].user.last_name} profile photo`}
                      rounded
                      size="md"
                      img={convo.conversations.conversation_users[0].user.avatar_url || ""}
                    />
                    {/* <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-500 text-pink-300 font-bold flex-shrink-0">T</div> */}
                    <div className="flex flex-col flex-grow ml-3">
                      <div className="text-sm font-medium">{`${convo.conversations.conversation_users[0].user.first_name} ${convo.conversations.conversation_users[0].user.last_name}`}</div>
                      <div className="text-xs truncate w-40">{convo.conversations.messages[0].text}</div>
                    </div>
                    {/* <div className="flex-shrink-0 ml-2 self-end mb-1">
                      <span className="flex items-center justify-center h-5 w-5 bg-red-500 text-white text-xs rounded-full">5</span>
                    </div> */}
                  </div>
                ))}
              {conversations?.length === 0 && (
                <div className="flex flex-1 flex-col text-center justify-center items-center">
                  <h5 className="text-2xl font-bold text-gray-400 dark:text-white">No Messages</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full bg-white dark:bg-gray-800 px-4 py-6 max-h-[calc(100vh-67px)]">
        {selectedConversation ? (
          !isMessagesLoading ? (
            <div className=" flex flex-col-reverse flex-0 overflow-y-scroll">
              {/* Message Component */}
              {messages &&
                messages.map((message) => (
                  <div className="flex items-start gap-2.5 py-4" key={message.id}>
                    <Avatar
                      alt={`${message.sent_by_user.first_name} ${message.sent_by_user.last_name} profile photo`}
                      rounded
                      size="sm"
                      img={message.sent_by_user.avatar_url || ""}
                    />
                    {/* <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-3.jpg" alt="Jese image" /> */}
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{`${message.sent_by_user.first_name} ${message.sent_by_user.last_name}`}</span>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          {moment(message.created_at).format("MMM DD, YYYY h:mm a")}
                        </span>
                      </div>
                      <div className="flex flex-col leading-1.5">
                        <p className="text-sm font-normal text-gray-900 dark:text-white">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col text-center justify-center items-center">
              <Spinner size="xl" />
            </div>
          )
        ) : (
          <div className="flex flex-1 flex-col text-center justify-center items-center">
            <h5 className="text-2xl font-bold text-gray-400 dark:text-white">No Conversation Selected</h5>
            <p className="text-gray-400">Select a conversation to begin messaging</p>
          </div>
        )}

        <MessageInput />
      </div>
    </div>
  );
}
