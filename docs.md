
# Requerimientos
Los experimentos se realizaron con Python 3.10.6, se requiere tener instalado una versi�n igual (o superior) a la antes mencionada [https://www.python.org/].

Para poder trabajar con las mismas librerias y sus correspondientes versiones se recomienda crear un entorno virtual dentro de la carpeta �experimentos/�, para ello se debe de abrir la consola en esta ruta, luego escribir 

> python -m venv venv_llm

Con esto se crear� una carpeta de nombre �venv_llm� la cual contendr� un entorno virtual de Python, para poder instalar las librer�as con sus respectivas versiones se debe de activar primero el entorno virtual:

En Windows:

> cd venv_llm\scripts
> activate

En macOS y Linux:

> source venv_llm/bin/act�vate

Una vez activado el entorno virtual se debe ejecutar el siguiente comando para instalar las librerias:

> pip install -r requirements.txt

# Estructura del Proyecto

- ## experimentos/
- ### llama3_70b/
  - #### temp0/
    - prompt_id_0/
    - prompt_id_1/
    - prompt_id_2/
    - prompt_id_3/
  - #### temp1/
    - prompt_id_0/
    - prompt_id_1/
    - prompt_id_2/
    - prompt_id_3/
- ### mixtral_8x7b/
  - #### temp0/
    - prompt_id_0/
    - prompt_id_1/
    - prompt_id_2/
    - prompt_id_3/
  - #### temp1/
    - prompt_id_0/
    - prompt_id_1/
    - prompt_id_2/
    - prompt_id_3/
- ### pruebas/
  - #### paes_fisica_2024/
    - paes_fisica_2024.xlsx
  - #### paes_matematicas_2024/
    - paes_matematicas_2024.xlsx
  - #### paes_matematicas2_2024/
    - paes_matematicas2_2024.xlsx
- ### resultadosMT/
  - [RESULTADOS MT EN FORMATO TIDY]
- .env
- codigos.ipynb
- graficas.ipynb
- requirements.txt
- tidy_data.xlsx

- ## prototype/
- .next/
- node_modules/
- public/
- src/
- .env.local
- .eslintrc.json
- components.json
- jsconfig.json
- next.config.mjs
- package.json
- package-lock.json
- postcss.config.mjs
- README.md
- tailwind.config.js


Dentro de la carpeta �experimentos� se crean todos los c�digos, carpetas y archivos necesarias para poder empezar a realizar los experimentos, de manera inicial se presentan las carpetas �llama3_70b� y �mixtral_8x7b� las cuales dentro de ellas tienen las carpetas �temp0� y �temp1� donde se guardaran para cada temperatura (0 y 1 respectivamente) los resultados para cada t�cnica de prompt en las subcarpetas: �prompt_id_0�, �prompt_id_1�, �prompt_id_2� y �prompt_id_3�, en estas carpetas se ir�n generando los archivos xlsx los cuales contendr�n las preguntas y respuestas que den los modelos para cada iteraci�n del experimento. Seguido de estas carpetas se tienen varios archivos que utilizaremos para generar los experimentos.

## pruebas/

Carpeta que contiene archivos xlsx correspondientes a las pruebas que se utilizaron para poder realizar los experimentos, cada archivo xlsx contiene la informaci�n relacionada con las preguntas y sus respuestas (alternativas).
resultadosMT/

Carpeta que contiene archivos Excel con los resultados obtenidos de los experimentos (en formato tidy)

## .env

Este archivo nos permite guardar y acceder a las API KEYS de los servicios de OpenAI, Groq Cloud y Together AI para poder acceder a sus modelos a trav�s de las API que estos servicios ofrecen, dentro del archivo .env las API KEYS se deben almacenar como se muestran a continuaci�n:

```.env
OPENAI_API_KEY = [OpenAI API KEY aqu�]

GROQ_API_KEY = [Groq API KEY aqu�]

TOGETHERAI_API_KEY = [Together AI API KEY aqu�]
```

## codigos.ipynb

Este archivo contiene todos los c�digos necesarios para poder configurar los prompts, par�metros, hacer las llamadas a las APIs, guardar los resultados en archivos xlsx, etc.
## graficas.ipynb

El archivo contiene los c�digos que nos permiten generar las gr�ficas que ser�n esenciales para poder visualizar y analizar los datos obtenidos de los experimentos.
requirements.txt

Archivo de texto que contiene un listado de todas las librer�as y sus versiones instaladas para poder realizar los experimentos.

## tidy_data.xlsx

Archivo Excel en el que podemos guardar los resultados obtenidos de los experimentos en una forma m�s estandarizada lo que nos facilitara realizar el an�lisis y las gr�ficas posteriormente.

# experimentos/
A continuaci�n, se procede a documentar los archivos y c�digos que se encuentran presentes en la carpeta de �experimentos�.

## codigos.ipynb
Este archivo tiene los c�digos principales para poder ejecutar y guardar los resultados de los experimentos, el archivo se divide en las siguientes secciones:

- Configuracion Principal 
    - Funciones de Utilidades
- Cargar Archivo con Preguntas
- Funci�n Llamadas a API
- Definicion de Prompts
    - Uso de Funci�n de llamada de API
- An�lisis REGEX de resultados
- Codigos para seleccionar resultados y recorrerlos
- Codigo genera el archivo tidy
- Guardar registros formato tidy

###	Sec: Configuraci�n Principal
Secci�n con c�digos que permite instalar librerias y definir funciones y par�metros que ser�n utilizados a lo largo del c�digo.

### Sec: Cargar Archivo con Preguntas
En esta secci�n se ejecuta un c�digo que abre una ventana en la que se debe seleccionar el archivo Excel que contiene las preguntas y respuestas de la prueba que se evaluara, el archivo de preguntas tiene las siguientes columnas:

- numero: numero enteroque representa el n�mero de la pregunta
- pregunta: texto que representa el enunciado de la pregunta
- a: texto que representa la respuesta de a 
- b: texto que representa la respuesta de b 
- c: texto que representa la respuesta de c 
- d: texto que representa la respuesta de d 
- respuesta: letra que indica cual es la alternativa correcta de la pregunta

CODIGO QUE ABRE UNA VENTANA QUE CONSULTA POR EL ARCHIVO:

```python
ruta_archivo = seleccionar_archivo_xlsx(msg="Seleccione el archivo que contiene las preguntas")

df = pd.read_excel(ruta_archivo[0])

if set(df.columns).issubset(["numero", "pregunta", "a", "b", "c", "d", "respuesta"]):
� � raise Exception("Verifique que estan las columnas necesarias en el archivo xlsx seleccionado")
else:
� � print("(OK) El archivo cumple con la estructura requerida y ha sido cargado correctamente")
```

### Sec: Funci�n Llamadas a API
Esta secci�n contiene el c�digo principal que ejecuta las llamadas a los modelos LLMs de diferentes APIs

### Funci�n get_api_response()
Funci�n principal que realiza las llamadas a los modelos y guarda las respuestas, la funci�n recibe los siguientes par�metros:

* model:str con el nombre del modelo LLM y servicio a usar,
* api_key:str que corresponde a la api del servicio a llamar,
* base_url:str | None un texto (o None) que se utiliza posee en caso de tener que cambiar la url de conecci�n con la API, por defecto es None y no deber�a haber problema con esto ya que Litellm se encarga de configurar esto,
* df: pd.DataFrame el dataframe que se carga del xlsx que contiene las preguntas y respustas de las pruebas,
* system_prompt: str el texto correspondiente al prompt del sistema,
* user_prompt_template:PromptTemplate prompt del usuario, en este caso son las distintas t�cnicas de prompt (est�n definidas dentro de codigos.ipyng),
* parameters:dict un diccionario con informaci�n variada para entregarle al modelo LLM,
* sleep_per_question:float=0 un valor decimal que permite que por cada llamada se espere X cantidad de tiempo antes de volver a realizar una pregunta,

La funci�n retorna un Pandas dataframe que contiene la siguiente informaci�n
* model: texto que permite guardar la info del modelo usado
* exec_time: valor decimal que representa el tiempo que se demoro entre realizar la consulta al modelo hasta recibir la totalidad de su respuesta
* params: diccionario que guarda la informaci�n de configuraci�n usada con el modelo
* question_num: texto que representa el n�mero de la pregunta consultada
* question_statement: texto que correspondiente al enunciado de la pregunta consultada.
* sys_content: texto que corresponde al prompt del sistema.
* user_content: texto que corresponde al prompt dado al LLM.
* llm_response: texto que corresponde a la respuesta entregada por el modelo
* usage: diccionario que contiene informaci�n correspondiente al uso del LLM, esto se corresponde con �completion_tokens�, �prompt_tokens� y �total_tokens�.

### Sec: Definici�n de Prompts
En esta secci�n se procede a definir los distintos prompts para cada t�cnica de prompt. Se definen de la siguiente forma:
- system = �� => Este se deja como �� por defecto ya que no se realizaron experimentos con distintos prompts del sistema para de esta forma poder medir las capacidades base de cada modelo
- prompt_0: Correspondiente al prompt_id_0
- prompt_1: Correspondiente al prompt_id_1
- prompt_2: Correspondiente al prompt_id_2
- prompt_3: Correspondiente al prompt_id_3
### Sec: Uso de Funci�n de llamada de API
En esta parte se tiene un c�digo que utiliza la funci�n �seleccionar_carpeta� la cual abre una ventana en la que se consulta por la carpeta donde se desea guardar los resultados que se obtendr� tras consultar al modelo LLM, por ejemplo si se quisiera evaluar al modelo LLAMA3-70B con temperatura 0 la t�cnica de prompt 0 (Sin usar t�cnica) entonces se debe de seleccionar la ruta: llama3_70b/temp0/prompt_id_0

Al seleccionar la carpeta objetivo se imprimir� en pantalla un mensaje que servir� para corroborar donde se guardaran los archivos generados.

Ejemplo de Mensaje en pantalla:
```
Los archivos generados se guardaran en:
C:\Users\...\RepertorioTesis\experimentos\llama3_70b\temp0\prompt_id_0
```

A continuaci�n, se tiene el c�digo que organiza todos los par�metros y configuraciones y ejecuta la funci�n para llamar a las APIs. De este c�digo lo que nos interesa es la siguiente secci�n:
```python
# -------------- PARAMETROS -------------------

# MODELO:
modelo:str = "groq/llama3-70b-8192"
# modelo:str = "groq/mixtral-8x7b-32768"
# modelo:str = "openai/gpt-3.5-turbo-0125"
# modelo:str = "together_ai/mistralai/Mixtral-8x22B-Instruct-v0.1"
# modelo:str = "openai/lmstudio-community/Phi-3-mini-4k-instruct-GGUF"
#! base_url = "http://localhost:1224/v1" # En caso de usar LM Studio configurar acorde

# API KEY:
api_key = groq_api_key

# PARAMETROS:
parametros:dict = {
� � "temperature": 0,
� � "max_tokens": 2_700,
� � "frequency_penalty": 0,
� � "stream": False,
� � "top_p": 1.0,
}

# CONFIGURACI�N GUARDADO ARCHIVOS
ITERACIONES:int = 1 
NUM_INICIAL_GUARDAR:int = 1 #N�mero con el que se empezara a guardar el archivo ej: "result_1"
SLEEP_PER_QUESTION:list[float] = [2,5] #Numero random entre estos valores que se descansara entre pregunta
MENSAJE_AL_TERMINAR:bool = True # True si quiere un popup en pantalla al terminar de ejecutar codigo
# -------------------------------------------------
```

En esta se puede configurar el modelo que se llamar�, el servicio, los par�metros, el n�mero de iteraciones, el n�mero inicial con el que se comienza a guardar cada archivo xlsx, tiempo a esperar entre pregunta (para no saturar a la API) y un boolean que permite mostrar un �popup� al finalizar de ejecutar este fragmento de c�digo.

- Modelo: Se selecciona el modelo y el servicio al que se conectara, litellm permite manejar diversos servicios y modelos al solo modificar la ruta, teniendo el formato �[servicio]/[modelo_del_servicio]�
    - Base_url: Este valor debe de ser modificado solo en el caso que se ejecute LM Studio para poder usar alg�n modelo de manera local.
- Api_key: Se debe definir la api key que se utilizara para el servicio deseado.
- Par�metros: se configuran los par�metros de interes, en esta secci�n para nuestro experimento solo nos interesa la temperatura, el resto son los valores por defecto (excepto por �max_tokens� el cual se dejo con 2700 tokens para que el modelo no se pase en caso de respuestas demasiadamente extensas)
- ITERACIONES: Es un numero entero que sirve para configurar el script de tal forma de poder efectuar X iteraciones para cada modelo, si se pone 5 esto implica que se realizar�n las preguntas de la prueba 5 veces y se iran almacenando las respuestas para cada iteraci�n.
- NUM_INICIAL_GUARDAR: N�mero entero que representa el n�mero con el que se empezara a guardar las respuestas dada por el modelo, por ejemplo si se pone el n�mero 3 y se definen 2 iteraciones, entonces en la carpeta seleccionada (ej: �llama3_70b/temp0/prompt_id_0�) se ir�n guardando los archivos �results_3� y �results_4� ya que se hacen 2 iteraciones empezando desde n�mero 3.
- SLEEP_PER_QUESTION: lista de dos n�meros que permiten configurar un valor aleatorio entre ambos para que se descanse entre pregunta para evitar saturar la API con las consultas.
- MENSAJE_AL_TERMINAR: Un bool que si se deja en True entonces se mostrara un popup al terminar de ejecutar el script, �til para cuando se desea dejar el c�digo ejecut�ndose en segundo plano.

### Sec: An�lisis REGEX de resultados
La siguiente secci�n contiene la clase 
```python
class RegexAnalyzerFisica()
```

Esta clase tiene definida multiples funciones que permiten cargar los archivos xlsx de resultados de las consultas y poder guardarlos en un formato tidy data. Para poder utilizarla se debe de ejecutar el c�digo presente en �Codigos para seleccionar resultados y recorrerlos� en esta parte se abre una pesta�a en la cual se debe de seleccionar todas las carpetas �prompt_id_X� que se quieran ir guardando en un archivo xlsx con formato tidy.

Para registrar las carpetas se deben de seleccionar y a�adir una por una como se muestra a continuaci�n

* Primero seleccionar carpeta
* Segundo presionar boton "Seleccionar carpeta"
    * Cada vez que se presiona  "Seleccionar carpeta" la carpeta a�adida es almacenada en una lista
* Tercero continuar a�adiendo carpetas, una vez a�adidas todas presionar el boton "cancelar" (esto cerrara la ventana actual manteniendo la lista de las carpetas seleccionadas en el codigo)


Este proceso se repite hasta que se hayan registrado todas las carpetas objetivo y luego se presiona cancelar para terminar el proceso de registro de carpetas.
A continuaci�n, se presenta la funci�n generate_excel_file(file_path) la cual se encuentra presente en la secci�n �Codigo genera el archivo tidy�, al ejecutar este c�digo se generar� un archivo xlsx con el nombre �tidy_data.xlsx� que tendr� las columnas necesarias para poder almacenar los resultados de una forma m�s estandarizada.
3.1.8.	RegexAnalyzer [Sec: Guardar registros formato tidy]
En esta secci�n se tiene el c�digo que ir� revisando todos los archivos de resultados guardados en las carpetas antes ingresadas para poder verificar la alternativa seleccionada por cada modelo.

El c�digo definido que realiza esto es el siguiente:
```python
respuestas_correctas = [
    'b', 'b', 'd', 'b', 'a', 'b', 'c', 'd', 'c', 
    'c', 'b', 'd', 'd', 'a', 'b', 'a', 'b', 'a', 
    'b', 'c', 'b', 'c', 'c', 'c', 'b', 'c', 'b',
    'd', 'c', 'd']

for key, data in folders_data_llama3.items():
    RegexAnalyzerFisica(
        files_paths=data, 
        respuestas_correctas=respuestas_correctas,
        guardar_registros=False
        )
```

La clase 
```python
RegexAnalyzerFisica 
```
recibe los siguientes par�metros:
- Files_paths: Son las rutas de todas las carpetas antes registradas.
- Respuestas_Correctas: una lista que debe de contener las letras (str) que corresponde a la alternativa correcta para cada pregunta para cada prueba.
- Guardar_registros: Bool el cual guardara las respuestas en el archivo �tidy_data.xlsx� si es False no se guardar�n los datos, si s True se registrar�n.

En esta parte es importante ejecutar por primera vez el c�digo con �guardar_registros=False� ya que la clase RegexAnalyzerFisica imprimir� en pantalla todas las preguntas que la funci�n lo logre identificar.

Por ejemplo [Mensaje imprimido en consola]:
```yaml
FILE READED:
groq_1.xlsx
(0-0) < |Accuracy: 83.33333333333334% |
Tesis Results Updated succesfully
Tesis Path:
--- 2) ---
vamos a analizar cada opcion paso a pasoa) las direcciones de la aceleracion y de la fuerza f no necesariamente son paralelas, ya que hay otra fuerza
```

En este caso en la pregunta 2) (marcada con "--- 2) ---" no se logr� identificar correctamente, se imprime la respuesta dada por el modelo y manualmente se puede revisar cual fue la respuesta dada por el modelo, en este caso el modelo respondi� que la respuesta correcta es �alternativa **a**� esta forma de responder (con la �a� entre �**�) no fue identificada por lo tanto se debe de a�adir esta respuesta dentro de RegexAnalyzerFisica de la siguiente forma:
- Copiar la respuesta �alternativa **a**�
- Ir a RegexAnalyzerFisica en la funci�n get_llm_answer(self, llm_response:str) -> str en esta funci�n para este caso se respondi� la alternativa �a� por lo que esta nueva forma de responder se debe de a�adir dentro de la lista �a_filters�
```python
a_filters = [
            "la respuesta correcta es a)", "la respuesta correcta es: a)", "puedo concluir que la opcion a) es la inferencia consistente",
            "respuesta correcta es: a)", "la hip�tesis que guio el experimento es: a)", "el objetivo de investigaci�n pertinente es: a)",
            "respuesta correcta es la opcion a)", "la opcion correcta es: a)", "la respuesta m�s probable es la a)",
            "la opcion a) es la inferencia consistente", "la opcion a) es la que permite comprobar la relaci�n",
            "la pregunta que se ajusta a este experimento es: a)", "la respuesta m�s precisa es: a)",
            "lo que se puede hacer mediante la opcion a).",
            "en conclusion, la opcion a) es la que permite comprobar la relacion", "la opcion a) es la mas adecuada",
            "alternativa **a**"
            ]
```

Se emplea este m�todo porque algunos modelos (sobre todo mixtral mas que llama) tiende a responder de varias formas distintas algunas veces en formato latex, otras utilizando distintas palabras o expresiones.
Una vez a�adidas todas las formas de responder detectadas se puede cambiar el par�metro Guardar_registros a True para poder guardar definitivamente los resultados.

---

## graficas.ipynb
Este archivo contiene todos los c�digos necesarios para poder realizar las gr�ficas de los datos almacenados en formato tidy (por defecto en el archivo �tidy_data.xlsx�)
Para poder hacer pruebas de los c�digos se pueden utilizar los archivos Excel que se encuentran en la carpeta �resultadosMT/� la cual contiene los resultados obtenidos durante la realizaci�n de los experimentos. Los archivos presentes en esta carpeta son los siguientes:
- extensi�n_chatgpt_3_5_turbo.xlsx: Resultados de probar ChatGPT-3.5-Turbo frente a PAES M1
- extensi�n_mixtral_8x22b.xlsx: Resultados del modelo Mixtral-8x22b frente a PAES M1
- extensi�n_phi3.xlsx: Resultados de modelo Phi-3-mini frente a PAES M1
- f�sica_llama3_70b.xlsx: Resultados de LLaMA3-70b frente a prueba PAES F�sica 
- paes_m1_llama3_70b_mixtral_8x7b.xlsx: Resultados de modelos LLaMA3-70b y Mixtral-8x7b frente a PAES M1
- paes_m2_llama3_70b.xlsx: Resultados LLaMA3-70b frente a PAES M2
- all_results.xlsx: Archivo que contiene al conjunto de todos los resultados antes mencionados en este Excel

###	Sec: Gr�fica Rendimiento General (IC)
En esta secci�n se genera la figura que permite visualizar el rendimiento general de cada modelo y configuraci�n (prompt_id y temperatura) con un intervalo de confianza del 95%.

El c�digo autom�ticamente detecta los modelos que est�n en el dataframe cargado/seleccionado y genera las gr�ficas acorde





###	Sec: Gr�fica Rendimiento General (IC)
En esta secci�n se genera la figura que permite visualizar el rendimiento general de cada modelo y configuraci�n (prompt_id y temperatura) con un intervalo de confianza del 95%.

El c�digo autom�ticamente detecta los modelos que est�n en el dataframe cargado/seleccionado y genera las gr�ficas acorde
 
###	Sec: Errores
C�digo que grafica la cantidad de errores que se cometieron en total para cada pregunta y para cada modelo detectado en el dataframe.
 

###	Sec: Mapas de Calor
En esta parte se tiene el c�digo que permite realizar un mapa de calor para un modelo, temperatura y prompt_id especificado, en el c�digo se debe de configurar manualmente el modelo, temperatura y prompt_id que se desean generar, si se desea ver para el modelo LLaMA3-70b el mapa de calor para prompt_id 0 con temperatura 0 y 1, entonces, se debe de establecer la siguiente variable:
```python
selected_config = [
    {"model": "llama3_70b", "temperature": 0, "prompt_id": 0},
    {"model": "llama3_70b", "temperature": 1, "prompt_id": 0},
    ]
```

Seguido de esto se puede definir si se desea que se muestren de color verde o rojo cada casilla con un 1 o 0 si es correcta o incorrecta respectivamente, para esto se debe definir �annot_config� como True. Por ejemplo para la configuraci�n establecida en �selected_config� anterior y con �annot_config = True� se genera lo siguiente:
```python
#------- PARAMETROS CONFIGURACION GR�FICA------------------------------------
selected_config = [
    {"model": "llama3_70b", "temperature": 0, "prompt_id": 0},
    {"model": "llama3_70b", "temperature": 1, "prompt_id": 0},
    ]

annot_config = True
```

###	Sec: Relacion rendimiento, tokens generados y tokens de prompt
En esta parte del c�digo se pueden graficar la relaci�n entre los tokens (tanto generados como los enviados al modelo) con el rendimiento, para este c�digo se puede modificar lo siguiente:
```python
# ----------- PARAMETROS ----------------------------------
MODELO = "llama3_70b"
FIGURE_TITLE_SIZE = 25
FIGURE_TITLE = 'Rendimiento - Tokens Generados - Tiempo ejecuci�n, Mixtral-8x22b'
# ----------------------------------------------------------
```
Donde:
- Modelo: es el modelo que se desea graficar (debe estar dentro del dataframe seleccionado)
- Figure_title_size: el tama�o del t�tulo que tendr� la gr�fica
- Figure_title: el t�tulo que tendr� la gr�fica

###	Sec: Ditribucion de par�metros
Este c�digo grafica como se distribuyen los par�metros: tokens generados, tokens de prompt y tiempo de ejecuci�n (Exec_time). En esta secci�n se puede configurar lo siguiente:
```python
# -------- PARAMETROS ----------------
FONTSIZE_SUBPLOTS = 25
LABELSSIZE_SUBPLOTS = 20

AUX_PROMPT_ID = 0
# -----------------------------------
```
Donde:
- Fontsize_subplots: es el tama�o que tendr� la fuente de las sub gr�ficas (para cada par�metro)
- Labelssize_subplots: el tama�o que tendr�n las etiquetas de la sub gr�ficas
- Aux_prompt_id: el n�mero del prompt_id que se desea evaluar