import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URI = "https://connecthive-connectbackend.onrender.com"; 
const API_URL = `${API_URI}/api/chat`;

const Chat = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            fetchChatList(storedUser.id);
        }
    }, []);

    const fetchChatList = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/getChats/${userId}`);
            const formattedChats = response.data.map(chat => ({
                id: chat.chat_id,
                name: chat.contact_name,
                contactId: chat.contact_id
            }));
            setChatList(formattedChats);
            localStorage.setItem("chatList", JSON.stringify(formattedChats));
        } catch (error) {
            console.error("Error fetching chat list:", error);
        }
    };

    useEffect(() => {
        if (searchQuery.length >= 1) {
            fetchSearchResults();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const fetchSearchResults = async () => {
        try {
            const response = await axios.post(`${API_URL}/search`, { query: searchQuery });
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };

    const handleStartChat = async (recipient) => {
        if (chatList.some(chat => chat.contactId === recipient.id)) {
            console.log("Chat already exists with this user.");
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/addChat`, {
                user_id: user.id,
                contact_id: recipient.id,
            });
            const newChat = {
                id: response.data.chat_id,
                name: recipient.name,
                contactId: recipient.id,
            };
            setChatList((prev) => [...prev, newChat]);
            setSelectedChat(newChat);
            fetchMessages(newChat.id);
        } catch (error) {
            console.error("Error starting chat:", error);
        }
    };

    const fetchMessages = async (chatId) => {
        try {
            const response = await axios.get(`${API_URL}/getMessages/${chatId}`);
            setMessages(response.data);
            setSelectedChat(chatList.find((c) => c.id === chatId));
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!selectedChat || !messageInput.trim()) return;

        const newMessage = {
            id: Date.now(),
            senderId: user.id,
            recipientId: selectedChat.contactId,
            message: messageInput,
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessageInput("");

        try {
            await axios.post(`${API_URL}/sendMessage`, {
                chat_id: selectedChat.id,
                senderId: user.id,
                recipientId: selectedChat.contactId,
                message: messageInput,
            });
            fetchMessages(selectedChat.id);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-gray-100">
            <div className="w-1/3 bg-white shadow-lg p-4">
                <h2 className="text-lg font-semibold">Chat List</h2>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 border rounded mt-2"
                />
                <ul className="mt-2">
                    {searchResults.map((result) => (
                        <li key={result.id} onClick={() => handleStartChat(result)}
                            className="p-2 hover:bg-gray-200 cursor-pointer rounded">
                            {result.name}
                        </li>
                    ))}
                </ul>
                <h3 className="text-lg font-semibold mt-4">Saved Chats</h3>
                <ul>
                    {chatList.map((chat) => (
                        <li key={chat.id} onClick={() => fetchMessages(chat.id)}
                            className="p-2 hover:bg-gray-200 cursor-pointer rounded">
                            {chat.name}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-2/3 p-4 flex flex-col">
                {selectedChat ? (
                    <>
                        <h2 className="text-xl font-semibold">Chat with {selectedChat.name}</h2>
                        <div className="flex-1 bg-white p-4 border rounded overflow-y-auto h-96">
                            {messages.length > 0 ? (
                                <div className="flex flex-col space-y-2">
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}>
                                            <div className={`p-2 rounded mb-2 max-w-xs ${msg.senderId === user.id ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                                                <b>{msg.senderId === user.id ? "You" : selectedChat.name}:</b> {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No messages yet</p>
                            )}
                        </div>
                        <div className="flex mt-4">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 p-2 border rounded"
                            />
                            <button onClick={handleSendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
                                Send
                            </button>
                        </div>
                    </>
                ) : (
                    <h2 className="text-xl font-semibold">Select a chat to start messaging</h2>
                )}
            </div>
        </div>
    );
};

export default Chat;