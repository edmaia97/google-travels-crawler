#!/usr/bin/env python
# coding: utf-8

# In[1]:


from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

import pandas as pd
import time


# In[2]:


DELAY = 3


# In[3]:


options = webdriver.ChromeOptions()
options.add_argument("--headless=new")


# In[4]:


driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
driver.maximize_window()
driver.get('https://www.google.com/travel/flights')


# In[5]:


form = WebDriverWait(driver, 20).until(
    EC.visibility_of_element_located(
        (By.XPATH, '//div[@class= "AJxgH"]')
    )
)
inputs = form.find_elements(By.TAG_NAME, 'input')


# In[6]:


inputs[0].click()
# driver.implicitly_wait(DELAY)
time.sleep(DELAY)


# In[7]:


inputs[1].send_keys('Fortaleza')
inputs[1].send_keys(Keys.ENTER)
# driver.implicitly_wait(DELAY)
time.sleep(DELAY)


# In[8]:


inputs[2].click()
# driver.implicitly_wait(DELAY)
time.sleep(DELAY)


# In[9]:


inputs[3].send_keys('Manaus')
inputs[3].send_keys(Keys.ENTER)
# driver.implicitly_wait(DELAY)
time.sleep(DELAY)


# In[10]:


inputs[4].click()
# driver.implicitly_wait(DELAY)
time.sleep(DELAY)


# In[11]:


# inputs[6].clear()
inputs[6].send_keys('01/06/2023')
time.sleep(DELAY)
inputs[6].send_keys(Keys.ENTER)
# driver.implicitly_wait(DELAY)
time.sleep(DELAY)


# In[12]:


# inputs[5].click()


# In[13]:


inputs[7].send_keys(Keys.CONTROL + "a")
time.sleep(DELAY)
inputs[7].send_keys('30/08/2023')
time.sleep(DELAY)
inputs[7].send_keys(Keys.ENTER)
# driver.implicitly_wait(DELAY)
time.sleep(DELAY)


# In[14]:


buscar = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located(
        (By.XPATH, '//div[@class= "WXaAwc"]')
    )
)
buscar.click()
time.sleep(DELAY)


# In[15]:


buscar = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located(
        (By.XPATH, '//div[@class= "xFFcie"]')
    )
)
buscar.click()
time.sleep(DELAY)


# In[16]:


lista_melhores = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located(
        (By.XPATH, '//ul[@class="Rk10dc"]')
    )
)
time.sleep(DELAY)


# In[17]:


dados = []
itens = lista_melhores.find_elements(By.TAG_NAME, 'li')
for i,_ in enumerate(itens):
    horario_partida = lista_melhores.find_element(By.XPATH, f'//li[{i+1}]/div/div[2]/div/div[2]/div[2]/div[1]/span/span[1]/span/span/span').text
    horario_chegada = lista_melhores.find_element(By.XPATH, f'//li[{i+1}]/div/div[2]/div/div[2]/div[2]/div[1]/span/span[2]/span/span/span').text
    preco_viagem = lista_melhores.find_element(By.XPATH, f'//li[{i+1}]/div/div[2]/div/div[2]/div[6]/div[1]/div[2]/span').text
    empresa = lista_melhores.find_element(By.XPATH, f'//li[{i+1}]/div/div[2]/div/div[2]/div[2]/div[2]/span').text
    dados.append([horario_partida, horario_chegada, preco_viagem, empresa])
    
time.sleep(DELAY)


# In[18]:


df = pd.DataFrame(dados, columns = ['partida', 'chegada', 'preço', 'empresa'])
df


# In[ ]:


df.to_excel("crawler.xlsx")


# In[19]:


time.sleep(DELAY)


# In[20]:


driver.quit()

