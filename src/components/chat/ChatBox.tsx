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
import React from 'react';

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
  willChange: 'transform',
  contain: 'content',
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
  position: 'relative',
  transition: 'none',
  transform: 'translateZ(0)',
  WebkitFontSmoothing: 'antialiased',
  '& a': {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    fontWeight: 500,
    transition: 'color 0.2s',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'underline',
    },
  },
  '& strong': {
    fontWeight: 600,
  },
  '& .product-recommendation': {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2),
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
    position: 'relative',
    animation: 'fadeInUp 0.5s ease-out forwards',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-4px',
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #3f51b5, #f50057)',
      borderRadius: '4px 4px 0 0',
    },
    '@keyframes fadeInUp': {
      '0%': {
        opacity: 0,
        transform: 'translateY(10px)',
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
  },
  '& .product-list': {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2),
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-4px',
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #3f51b5, #f50057)',
      borderRadius: '4px 4px 0 0',
    },
  },
  '& .product-item': {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    backgroundColor: '#fff',
    border: '1px solid #eaeaea',
    marginBottom: theme.spacing(1),
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    '&:last-child': {
      marginBottom: 0,
    }
  },
  '& .product-link': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    padding: `${theme.spacing(0.7)} ${theme.spacing(1.5)}`,
    borderRadius: theme.spacing(5),
    fontSize: '0.95rem',
    fontWeight: 600,
    transition: 'all 0.25s ease',
    textDecoration: 'none',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      textDecoration: 'none',
    },
    animation: 'pulse 1.5s infinite alternate',
    '@keyframes pulse': {
      '0%': {
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      },
      '100%': {
        boxShadow: '0 4px 8px rgba(63, 81, 181, 0.4)',
      },
    },
  },
  '& b': {
    fontWeight: 600,
    color: '#e53935',
  },
  '& .emoji': {
    fontSize: '1.25rem',
  },
  '& .price-info': {
    color: '#e53935',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  '& .product-detail': {
    fontSize: '0.95rem',
    color: theme.palette.text.secondary,
    margin: `${theme.spacing(1)} 0`,
  }
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

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const TypingDots = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '& .dot': {
    width: '8px',
    height: '8px',
    backgroundColor: theme.palette.grey[400],
    borderRadius: '50%',
    animation: 'typingAnimation 1.5s infinite ease-in-out',
  },
  '& .dot:nth-of-type(1)': {
    animationDelay: '0s',
  },
  '& .dot:nth-of-type(2)': {
    animationDelay: '0.3s',
  },
  '& .dot:nth-of-type(3)': {
    animationDelay: '0.6s',
  },
  '@keyframes typingAnimation': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
    '50%': {
      transform: 'scale(1.5)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(1)',
      opacity: 0.5,
    },
  },
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
        // Format the response if it contains product data
        let formattedContent = response.data.data;
        
        if (formattedContent.includes('href="/product-left-sidebar/')) {
          // Check if it's a product list format
          if (formattedContent.includes('<div class="product-list">')) {
            // Already formatted as product list, just enhance the styling
            formattedContent = formattedContent.replace(/🛒/g, '<span class="emoji">🛒</span>');
            
            // Style all product links more attractively
            formattedContent = formattedContent.replace(
              /<a href="(\/product-left-sidebar\/[^"]+)"[^>]*><span class="emoji">🛒<\/span>\s*<strong>([^<]+)<\/strong><\/a>/g,
              '<a href="$1" class="product-link" target="_blank"><span class="emoji">🛒</span> <strong>$2</strong></a>'
            );
          } else {
            // Wrap the entire content in a product recommendation div
            formattedContent = `<div class="product-recommendation">${formattedContent}</div>`;
            
            // Convert the plain 🛒 emoji to a styled span
            formattedContent = formattedContent.replace('🛒', '<span class="emoji">🛒</span>');
            
            // Make the product link more attractive
            formattedContent = formattedContent.replace(
              /<a href="(\/product-left-sidebar\/[^"]+)"[^>]*><span class="emoji">🛒<\/span>\s*<strong>([^<]+)<\/strong><\/a>/g,
              '<a href="$1" class="product-link" target="_blank"><span class="emoji">🛒</span> <strong>$2</strong></a>'
            );

            // Highlight price information
            formattedContent = formattedContent.replace(
              /(\d+(\.\d+)?\s*(triệu|nghìn|đồng))/g, 
              '<span class="price-info">$1</span>'
            );

            // Style additional product details
            formattedContent = formattedContent.replace(
              /(còn \d+ sản phẩm)/g,
              '<span class="product-detail">$1</span>'
            );

            // Add more styling for product category
            formattedContent = formattedContent.replace(
              /(trong danh mục ([^\.]+))/g,
              'trong danh mục <strong>$2</strong>'
            );

            // Style emoji at the end
            formattedContent = formattedContent.replace(
              /(📱🛍️)/g,
              '<span class="emoji">$1</span>'
            );
          }
        }
        
        const botMessage: ChatMessage = {
          role: 'system',
          content: formattedContent,
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

  // Add this utility function for safely rendering HTML
  const createMarkup = (html: string) => {
    return { __html: html };
  };

  // Memoize the messages to prevent unnecessary re-renders
  const memoizedMessages = React.useMemo(() => {
    return messages.map((message) => (
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
          {message.role === 'user' ? (
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {message.content}
            </Typography>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ 
                wordBreak: 'break-word',
                minHeight: '1.5em',
                '& > div': { 
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }
              }}
              dangerouslySetInnerHTML={createMarkup(message.content)}
            />
          )}
        </Message>
      </MessageWrapper>
    ));
  }, [messages]);

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
              memoizedMessages
            )}
            
            {/* Typing indicator */}
            {sending && (
              <TypingIndicator>
                <Avatar 
                  sx={{ 
                    width: 36,
                    height: 36,
                    bgcolor: 'secondary.main',
                  }}
                >
                  <SmartToyIcon />
                </Avatar>
                <TypingDots>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </TypingDots>
              </TypingIndicator>
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