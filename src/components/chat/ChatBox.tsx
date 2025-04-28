'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Paper, Typography, TextField, Button, CircularProgress, Avatar, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import { getApiUrl } from '@/config/api';

const ChatBoxContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
}));

const ChatButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  width: 56,
  height: 56,
}));

const ChatWindow = styled(Paper)(({ theme }) => ({
  width: 450,
  height: 600,
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: 350,
    height: 500,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[100],
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.grey[400],
    borderRadius: '3px',
  },
}));

const MessageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  '&.user': {
    flexDirection: 'row-reverse',
  },
}));

const Message = styled(Box)(({ theme, role }) => ({
  maxWidth: '85%',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  backgroundColor: role === 'user' ? theme.palette.primary.main : theme.palette.grey[100],
  color: role === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  minWidth: 'auto',
  padding: theme.spacing(1),
}));

interface ChatMessage {
  role: string;
  content: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('login_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const getUserFromLocalStorage = () => {
    try {
      const userStr = localStorage.getItem('login_user');
      if (!userStr) {
        setError('Vui lòng đăng nhập để sử dụng chat');
        return null;
      }
      const user = JSON.parse(userStr);
      return user.id;
    } catch (error) {
      setError('Lỗi khi lấy thông tin người dùng');
      return null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const userId = getUserFromLocalStorage();
    if (userId) {
      fetchChatHistory(userId);
    }
  }, []);

  const fetchChatHistory = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(getApiUrl(`chatbot/history/${userId}`));
      if (response.data.success) {
        setMessages(response.data.data);
      } else {
        setError('Không thể tải lịch sử chat');
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Lỗi khi tải lịch sử chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userId = getUserFromLocalStorage();
    if (!userId) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: newMessage,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setSending(true);

    try {
      const response = await axios.post(getApiUrl('chatbot/send-message'), {
        userId: userId,
        message: newMessage
      });

      if (response.data.success) {
        const botMessage: ChatMessage = {
          role: 'system',
          content: response.data.data,
          _id: (Date.now() + 1).toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        setError('Không thể gửi tin nhắn');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Lỗi khi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  if (userRole !== 'user') {
    return null;
  }

  return (
    <ChatBoxContainer>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <ChatWindow elevation={3}>
          <ChatHeader>
            <Box display="flex" alignItems="center" gap={1}>
              <SmartToyIcon />
              <Typography variant="subtitle1" fontWeight="bold">
                Chat với trợ lý ảo
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              onClick={() => setIsOpen(false)}
              sx={{ color: 'inherit' }}
            >
              <CloseIcon />
            </IconButton>
          </ChatHeader>
          
          <MessageContainer>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress size={40} thickness={4} />
              </Box>
            ) : messages.length === 0 ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="body2" color="text.secondary">
                  Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!
                </Typography>
              </Box>
            ) : (
              messages.map((message) => (
                <MessageWrapper key={message._id} className={message.role === 'user' ? 'user' : ''}>
                  <Avatar 
                    sx={{ 
                      width: 36,
                      height: 36,
                      bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                    }}
                  >
                    {message.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                  </Avatar>
                  <Message role={message.role}>
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {message.content}
                    </Typography>
                  </Message>
                </MessageWrapper>
              ))
            )}
            <div ref={messagesEndRef} />
          </MessageContainer>

          <InputContainer>
            <StyledTextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={sending}
            />
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              size="small"
            >
              {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            </StyledButton>
          </InputContainer>
        </ChatWindow>
      </Collapse>

      {!isOpen && (
        <ChatButton onClick={() => setIsOpen(true)}>
          <ChatIcon />
        </ChatButton>
      )}
    </ChatBoxContainer>
  );
} 