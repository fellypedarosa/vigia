# Monitor de Segurança - Sistema de Detecção de Movimento

Um aplicativo inteligente de monitoramento de segurança que utiliza a webcam para detectar movimentos suspeitos em tempo real.

## 🚀 Funcionalidades

### 🎯 Detecção Inteligente de Movimento
- **Algoritmo avançado** de análise de pixels que ignora mudanças naturais de iluminação
- **Sensibilidade ajustável** em tempo real (1-100%)
- **Score de movimento** em tempo real para monitoramento preciso
- **Filtragem inteligente** que evita falsos positivos

### 📹 Monitoramento em Tempo Real
- **Feed de vídeo ao vivo** da webcam
- **Indicadores visuais** de status (monitorando, pausado, alerta)
- **Modo discreto** - interface pode ser minimizada para rodar em background
- **Controles remotos** via interface web (iniciar/pausar/parar)

### 📸 Sistema de Capturas
- **Captura automática** quando movimento é detectado
- **Histórico de capturas** com timestamp e score de intensidade
- **Galeria visual** das 10 capturas mais recentes
- **Dados exportáveis** em formato de imagem

### 🎨 Design Profissional
- **Interface escura** otimizada para monitoramento de segurança
- **Tema tech/security** com cores azul, verde e vermelho para status
- **Responsivo** - funciona em desktop, tablet e mobile
- **Animações suaves** e feedback visual imediato

### 📧 Alertas por E-mail (Requer Supabase)
- **Notificações automáticas** quando movimento é detectado
- **Imagens anexadas** do momento da detecção
- **Configuração simples** via integração Supabase

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Tailwind CSS** para design system
- **Shadcn UI** para componentes
- **Canvas API** para processamento de imagem
- **MediaDevices API** para acesso à webcam
- **Vite** para build otimizado

## 🏗️ Arquitetura

### Hooks Personalizados
- `useWebcam` - Gerencia acesso e controle da câmera
- `useMotionDetection` - Algoritmo de detecção de movimento
- `useToast` - Sistema de notificações

### Componentes Principais
- `SecurityMonitor` - Interface principal do sistema
- `EmailAlert` - Informações sobre alertas por email

### Algoritmo de Detecção
1. **Captura de frames** em intervalos de 200ms
2. **Análise de luminosidade** pixel por pixel
3. **Cálculo de diferenças** entre frames consecutivos
4. **Filtragem por threshold** baseado na sensibilidade
5. **Score final** baseado em porcentagem e intensidade das mudanças

## 🚀 Como Usar

### 1. Permissões
O aplicativo solicitará acesso à sua câmera na primeira vez.

### 2. Controles Básicos
- **Iniciar**: Ativa câmera e inicia detecção
- **Pausar**: Mantém câmera ativa mas para detecção
- **Parar**: Desativa completamente o sistema

### 3. Configuração
- Use o **slider de sensibilidade** para ajustar detecção
- **Minimize** a interface para monitoramento discreto
- Monitore o **score em tempo real** na parte inferior do vídeo

### 4. Alertas por E-mail
Para ativar envio de e-mails automáticos:
1. Conecte o projeto ao Supabase
2. Configure as credenciais de e-mail
3. O sistema enviará alertas automaticamente

## 📱 Responsividade

- **Desktop**: Interface completa com layout de duas colunas
- **Tablet**: Layout adaptativo otimizado  
- **Mobile**: Interface vertical com controles touch-friendly

## 🔒 Privacidade e Segurança

- **Processamento local**: Toda análise é feita no navegador
- **Sem uploads**: Imagens não são enviadas a servidores externos
- **Controle total**: Usuário controla quando câmera está ativa
- **Dados temporários**: Capturas são armazenadas apenas na sessão

## 🎯 Casos de Uso

- **Segurança residencial** - Monitoramento de ambientes
- **Escritórios** - Detecção de movimento após horário comercial  
- **Lojas pequenas** - Sistema de alerta básico
- **Monitoramento pessoal** - Qualquer ambiente que precise ser vigiado

## 🔧 Configurações Técnicas

### Parâmetros de Detecção
- **Resolução padrão**: 640x480px
- **Taxa de análise**: 5 FPS (200ms entre frames)
- **Sensibilidade**: 1-100% (padrão: 50%)
- **Área mínima**: 150 pixels alterados
- **Threshold**: 30 pontos de diferença de luminosidade

### Performance
- **CPU**: Baixo impacto computacional
- **Memória**: ~50MB para processamento de vídeo
- **Rede**: Zero - tudo roda localmente

Desenvolvido com ❤️ usando Lovable

### Rodar localmente
´
npm run dev
´