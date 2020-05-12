# -*- coding: utf-8 -*-
import smtplib
 
# Credenciais
remetente    = 'guilhermeroni@gmail.com'
senha        = 'guilherme850427'
 
# Informações da mensagem
destinatario = 'guilhermeroni@gmail.com'
destinatario2 = 'guilhermeroni@gmail.com'
assunto      = 'Amo vc <3'
texto        = 'Esse email foi enviado usando python! :)'
 
# Preparando a mensagem
msg = '\r\n'.join([
  'From: %s' % remetente,
  'To: %s' % destinatario,
  'Subject: %s' % assunto,
  '',
  '%s' % texto
  ])
 
# Enviando o email
server = smtplib.SMTP('smtp.gmail.com:587')
server.starttls()
server.login(remetente,senha)
server.sendmail(remetente, destinatario, msg)
server.sendmail(remetente, destinatario2, msg)
server.quit()