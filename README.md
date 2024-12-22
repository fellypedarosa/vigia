
# Vigia

![Vigia](https://github.com/user-attachments/assets/3f233fe3-28a2-4d9e-8069-d4839fbeebb8)


## Descrição

O **Vigia** é um programa que monitora movimentos usando a câmera do seu computador e envia notificações dos movimentos detectados via WhatsApp. Ele utiliza a biblioteca OpenCV para captura e processamento de imagens e o Selenium para automação do WhatsApp Web.

## Como Usar

### Passo a Passo

1. **Clone o repositório ou baixe os arquivos necessários.**
2. **Instale as dependências necessárias:**
   ```sh
   pip install opencv-python selenium webdriver-manager pyautogui pyperclip
   ```
3. **Execute o arquivo `vigia.bat` para iniciar o programa.**
4. **Na primeira execução, será necessário logar no WhatsApp Web.**
   - O programa espera 8 segundos para que você possa escanear o QR Code. Esse tempo pode ser ajustado no arquivo `vigia.py` na linha:
     ```python
     sleep(8) # Ajuste conforme necessidade para poder escanear o QR Code
     ```
5. **Certifique-se de que a conversa ou grupo do WhatsApp para onde deseja enviar as notificações esteja fixado como a primeira conversa na lista do WhatsApp Web.**

### Observações

- A automação utiliza o Selenium e está mapeando os botões do WhatsApp. Portanto, pode ser necessário ajustar os seletores (XPath e nomes de classes) no código Python caso o layout do WhatsApp Web seja alterado.

## Estrutura do Projeto

```plaintext
.
├── capturas/                # Diretório onde as imagens capturadas serão salvas
├── 

vigia.py

                 # Script principal do programa
└── executar_vigia.bat       # Arquivo para executar o programa
```

## Exemplo de Uso

1. **Inicie o programa:**
   - Execute ou crie um atalho do arquivo `vigia.bat`.
2. **Ajuste o ambiente para captura da imagem de referência:**
   - O programa irá capturar uma imagem de referência automaticamente após um breve período.
3. **Monitore os movimentos:**
   - O programa irá monitorar os movimentos e enviar notificações via WhatsApp quando detectar mudanças significativas.

## Dependências

- Python 3.x
- OpenCV
- Selenium
- WebDriver Manager
- PyAutoGUI
- Pyperclip
  
## Como Obter XPATH e CLASS_NAME
CLASS_NAME:
<img alt="Exemplo de CLASS_NAME" src="https://github.com/user-attachments/assets/0b703bf1-7bf3-49cf-8013-9df0c9bb9799">
XPATH:
<img alt="Exemplo de XPATH" src="https://github.com/user-attachments/assets/e2fb39fa-57cb-4eda-8065-6163639e75f3">


## Licença

Este projeto foi criado por Fellype Rosa, mas adoraria que voçê nos ajudasse a desenvouve-lo ainda mais.
