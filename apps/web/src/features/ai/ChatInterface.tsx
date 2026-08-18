import { useState } from 'react';
import { Box, Button, TextField, InputAdornment } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { AppIcon } from '../../design-system/components/AppIcon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  provider?: string;
  tokens?: { input: number; output: number };
  durationMs?: number;
}

const mockMessages: Message[] = [
  { id: '1', role: 'user', content: '¿Cuáles son las principales características del plan Enterprise?' },
  { id: '2', role: 'assistant', content: 'El plan Enterprise incluye: soporte 24/7, SLA de 99.9%, integraciones ilimitadas, hasta 100 usuarios, almacenamiento de 100GB, y un manager de cuenta dedicado.', model: 'gpt-4o', provider: 'OpenAI', tokens: { input: 25, output: 85 }, durationMs: 1200 },
  { id: '3', role: 'user', content: '¿Cómo puedo exportar mis contactos?' },
  { id: '4', role: 'assistant', content: 'Para exportar contactos: ve a Contactos → Selecciona los contactos → Haz clic en "Exportar" → Elige el formato (CSV, Excel) → Descarga el archivo. También puedes programar exportaciones automáticas desde Configuración.', model: 'gpt-4o', provider: 'OpenAI', tokens: { input: 20, output: 95 }, durationMs: 980 },
];

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSend = () => {
    if (!message.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage('');

    setTimeout(() => {
      const newAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `[Simulado] Respuesta generada por IA para: "${newUserMessage.content}"`,
        model: 'gpt-4o',
        provider: 'OpenAI',
        tokens: { input: Math.ceil(message.length / 4), output: 50 },
        durationMs: 850,
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    }, 1000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Chat IA</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Interactúa con los modelos de IA configurados.</Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          borderRadius: radius.md,
          border: `1px solid ${colors.border.default}`,
          backgroundColor: colors.surface.default,
          mb: 2,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 2,
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                p: 1.5,
                borderRadius: radius.md,
                backgroundColor: msg.role === 'user' ? colors.primary[600] : colors.neutral[50],
                color: msg.role === 'user' ? '#FFFFFF' : colors.text.primary,
              }}
            >
              <Box sx={{ fontSize: 13, lineHeight: 1.5 }}>{msg.content}</Box>
              {msg.role === 'assistant' && msg.model && (
                <Box sx={{ display: 'flex', gap: 2, mt: 1, pt: 1, borderTop: `1px solid ${colors.border.default}` }}>
                  <Box sx={{ fontSize: 10, color: colors.text.muted }}>{msg.provider}/{msg.model}</Box>
                  <Box sx={{ fontSize: 10, color: colors.text.muted }}>{msg.tokens?.input} → {msg.tokens?.output} tokens</Box>
                  <Box sx={{ fontSize: 10, color: colors.text.muted }}>{msg.durationMs}ms</Box>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe tu mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AppIcon name="message-circle" size={15} color={colors.text.muted} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': { borderRadius: radius.sm, fontSize: 13 },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          sx={{
            backgroundColor: colors.primary[600],
            '&:hover': { backgroundColor: colors.primary[700] },
            fontSize: 13,
            fontWeight: 500,
            borderRadius: radius.sm,
            px: 2,
          }}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
}
