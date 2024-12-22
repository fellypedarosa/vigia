import cv2
import numpy as np
from datetime import datetime
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from time import sleep
import pyautogui
import re
import pyperclip
######################################### CAMERA ########################################################
sleep(0) #Ajuste conforme a necessidade para iniciar o programa
# Obtém o diretório atual do script
diretorio_atual = os.path.dirname(os.path.abspath(__file__))

# Configuração do diretório para salvar imagens
diretorio_capturas = os.path.join(diretorio_atual, "capturas")
os.makedirs(diretorio_capturas, exist_ok=True)
# Inicializa a câmera
camera = cv2.VideoCapture(0)
if not camera.isOpened():
    print("Erro ao acessar a câmera. Verifique se ela está conectada e tente novamente.")
    exit()

# Captura da imagem de referência
print("Ajuste o ambiente. A imagem será capturada automaticamente...")
cv2.waitKey(0)  # Posso aumentar o tempo para registro de imagem de referencia

sucesso, quadro = camera.read()
if sucesso:
    referencia = cv2.cvtColor(quadro, cv2.COLOR_BGR2GRAY)
    referencia = cv2.GaussianBlur(referencia, (21, 21), 0)
    print("Imagem de referência capturada automaticamente!")

cv2.destroyAllWindows()
######################################### CAMERA! #######################################################
######################################## NAVEGADOR ######################################################
# Configuração do Selenium para o WhatsApp Web
user_profile = os.path.join(diretorio_atual, "Chrome_Vigia")
options = webdriver.ChromeOptions()
options.add_argument(f"user-data-dir={user_profile}")
options.add_argument("--profile-directory=Default")

servico = Service(ChromeDriverManager().install())
navegador = webdriver.Chrome(service=servico, options=options)
sleep(3)
navegador.get('https://web.whatsapp.com/')
sleep(8) #Ajuste conforme necessidade para poder escanear o QR Code
ultimo_registro = time.time()

notificacoes = navegador.find_elements(By.CLASS_NAME, '_ahlk')
if notificacoes:
    notificacoes[0].click()
    sleep(1)
##################################### FUNCAO PARA ENVIAR MSG ##################################################
def enviar_mensagem():
    barra_mensagem = navegador.find_element(By.XPATH, '//*[@id="main"]/footer/div[1]/div/span/div/div[2]/div[1]/div/div[1]/p') # Muda
    barra_mensagem.send_keys(Keys.CONTROL + "v")
    sleep(1)
    barra_mensagem.send_keys(Keys.ENTER)
    
gravacao_iniciada = 'O Vigia Foi Iniciado com Sucesso!'
pyperclip.copy(gravacao_iniciada)
enviar_mensagem()
##################################### FUNCAO PARA ENVIAR MSG! #################################################
######################################## NAVEGADOR! #####################################################
######################################## GRAVAÇÃO #######################################################
try:
    while True:
        ################################ WhatApp #################################################################
        notificacoes = navegador.find_elements(By.CLASS_NAME, '_ahlk')
        if notificacoes:
            notificacoes[0].click()
            sleep(1)
        
        if os.path.exists("historico_conversa.txt"): # Se tiver esse arquivo ele será removido
            os.remove("historico_conversa.txt")

        todas_mensagens = '' # A CADA NOVO LOOP, A NOSSA LISTA DE MENSAGENS ZERA NOVAMENTE
        historico_conversa = '' # A CADA NOVO LOOP, O NOSSO HISTORICO DE CONVERSA ZERA NOVAMENTE
        todas_mensagens = navegador.find_elements('class name', '_ajx_') #Muda
            
        if todas_mensagens:
            
            for msg in todas_mensagens:
                mensagem = msg.text
            mensagem = mensagem.replace('\n', ' ')
            # Encontrar todas as ocorrências de horários no texto
            horarios = re.findall(r'\b\d{2}:\d{2}\b', mensagem)
            # Dividir o texto nas mensagens usando os horários como delimitadores
            partes = re.split(r'(\b\d{2}:\d{2}\b)', mensagem)
            # Combinar as partes corretamente para associar mensagens aos horários
            mensagens_com_horario = []
            for i in range(0, len(partes) - 1, 2):
                mensagem = partes[i].strip()
                horario = partes[i + 1].strip()
                mensagens_com_horario.append((mensagem, horario))
            # Exibir mensagens formatadas
            for mensagem, horario in mensagens_com_horario:
                historico_conversa += (f"{mensagem} - horario: {horario}, ")
                            
            if len(historico_conversa) > 1200:
                print('Historico muito Grande. Reduzido aos ultimos 1200ct')
                historico_conversa = historico_conversa[-1200:]    
        ################################ WhatApp! ################################################################
        ############################################### Parar ####################################################
            parada_forcada = r"Desativar.Vigia" #Altere conforme necessidade para interromper o vigia ao ler a mensagem (Cuidado, para iniciar o vigia novamente a frase/palavra precisa ser excluida na conversa do WP)
            forcar = re.search(parada_forcada, historico_conversa)
            if forcar:
                print('Forçado a Parada!')
                break
        ############################################### Parar! ###################################################
        ############################################# MOVIMENTO ################################################
        # Detecção de movimento
        sucesso, quadro_atual = camera.read()
        if not sucesso:
            break

        quadro_atual_cinza = cv2.cvtColor(quadro_atual, cv2.COLOR_BGR2GRAY)
        quadro_atual_cinza = cv2.GaussianBlur(quadro_atual_cinza, (21, 21), 0)

        diferenca = cv2.absdiff(referencia, quadro_atual_cinza)
        _, limiar = cv2.threshold(diferenca, 40, 255, cv2.THRESH_BINARY)

        contornos, _ = cv2.findContours(limiar, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        area_total = sum(cv2.contourArea(c) for c in contornos)

        if area_total < 2000:  # Ignora movimentos pequenos
            continue

        if time.time() - ultimo_registro > 2:  # Espera 2 segundos entre capturas
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            nome_arquivo = os.path.join(diretorio_capturas, f"movimento_{timestamp}.jpg")
            nome_captura = os.path.join(f"movimento_{timestamp}.jpg")
            cv2.imwrite(nome_arquivo, quadro_atual)
            print(f"Movimento detectado! Imagem salva: {nome_arquivo}")
        ############################################# MOVIMENTO! ##############################################
            ################################ ALERTA ##########################################################
            # Enviar a imagem pelo WhatsApp
            try:
                #notificacoes = navegador.find_elements(By.CLASS_NAME, '_ahlk')
                if notificacoes:
                    notificacoes[0].click()
                    sleep(1)
            
                # Encontrar o botão para anexar e clicar
                anexar_btn = navegador.find_element(By.CLASS_NAME, 'x9f619.x78zum5.x6s0dn4.xl56j7k.x1ofbdpd._ak1m') #Mudar conforme CLASS_NAME do botão de anexar arquivos do WP Web
                anexar_btn.click()
                sleep(1)
            
                # Clicar na opção "Foto/Vídeo"
                foto_video_btn = navegador.find_element(By.XPATH, '//*[@id="app"]/div/span[5]/div/ul/div/div/div[2]/li') #Mudar conforme XPATH do botão Foto ou Video do WP Web
                foto_video_btn.click()
                sleep(2)
                
                # Encontrar o campo de input de arquivo e enviar o caminho do arquivo
                pyautogui.write(nome_captura)
                sleep(2)
                pyautogui.press('enter')
                sleep(1)
            
                # Encontrar o botão de envio e clicar
                enviar_btn = navegador.find_element(By.XPATH, '//*[@id="app"]/div/div[3]/div/div[2]/div[2]/span/div/div/div/div[2]/div/div[2]/div[2]/div')  #Mudar conforme XPATH do botão de enviar mensagem com imagem do WP
                enviar_btn.click()
                print("Imagem enviada com sucesso!")
            except Exception as e:
                print(f"Erro ao enviar imagem pelo WhatsApp: {e}")

            ultimo_registro = time.time()

        cv2.imshow("Monitoramento", quadro_atual)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            ######################################## ALERTA! #######################################################
finally:
    camera.release()
    cv2.destroyAllWindows()
    navegador.quit()
######################################## GRAVAÇÃO! ######################################################
