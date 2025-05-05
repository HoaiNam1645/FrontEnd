'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, CircularProgress, Avatar, IconButton, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/config/api';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/reducers/registrationSlice';

const ChatContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
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
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&.user': {
    flexDirection: 'row-reverse',
  },
}));

const Message = styled(Box)(({ theme, role }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: role === 'user' ? theme.palette.primary.main : theme.palette.grey[100],
  color: role === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  minWidth: '100px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
}));

interface ChatMessage {
  role: string;
  content: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const getUserFromLocalStorage = () => {
    try {
      const userStr = localStorage.getItem('login_user');
      if (!userStr) {
        setError('Vui lòng đăng nhập để sử dụng chat');
        router.push('/login');
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

  const handleLogout = () => {
    localStorage.removeItem('login_token');
    localStorage.removeItem('login_user');
    dispatch(logout());
    window.location.href = '/login';
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          textAlign: 'center',
          mb: 4,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        Chat Dashboard
      </Typography>
      
      <ChatContainer elevation={3}>
        <MessageContainer>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : messages.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography variant="h6" color="text.secondary">
                Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!
              </Typography>
            </Box>
          ) : (
            messages.map((message) => (
              <MessageWrapper key={message._id} className={message.role === 'user' ? 'user' : ''}>
                <Avatar 
                  sx={{ 
                    bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                    width: 40,
                    height: 40,
                  }}
                >
                  {message.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                </Avatar>
                <Message role={message.role}>
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {message.content}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      mt: 1,
                      opacity: 0.7,
                      fontSize: '0.75rem'
                    }}
                  >
                    {new Date(message.createdAt).toLocaleString()}
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
            variant="outlined"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            multiline
            maxRows={4}
            disabled={sending}
          />
          <StyledButton
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            endIcon={sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          >
            {sending ? 'Sending...' : 'Send'}
          </StyledButton>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
} 