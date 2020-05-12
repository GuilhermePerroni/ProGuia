import smtplib

smtp = smtplib.SMTP('smtp.gmail.com', 587)
smtp.starttls()

smtp.login('guilhermeroni@gmail.com', 'guilherme850427')

de = 'guilhermeroni@gmail.com'
para = ['guilhermeroni@gmail.com']
msg = """From: %s
To: %s
Subject: Amo vc <3

Email de teste do Buteco Open Source.""" % (de, ', '.join(para))

smtp.sendmail(de, para, msg)

smtp.quit()