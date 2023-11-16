import eel
import re

def analisador_sintatico(input_string):
    """
        Condicional para verificar se na entrada contém uma expressão válida
    """
    if re.match("^[0-9]+ [+-/*] [0-9]+$", input_string):
        return True
    else:
        return False
    
def analise_semantica(input_string):
    """
    Verifique se a entrada é uma expressão válida
    """

    if not analisador_sintatico(input_string):
        return "Erro, programa não compilado."

    # Divida a expressão em número1, operador e número2
    partes = input_string.split()
    numero1 = int(partes[0])
    operador = partes[1]
    numero2 = int(partes[2])

    #Análise Semântica com base n operador
    if operador == '+':
        resultado = numero1 + numero2
    elif operador == '-':
        resultado = numero1 - numero2
    elif operador == '*':
        resultado = numero1 * numero2
    elif operador == '/':
        if numero2 == 0:
            raise Exception("Erro, divisão por zero.")
        resultado = numero1 / numero2
    return f"{resultado}"


def format_text(value):
        """
            Função para formatação do texto incluindo esperações entres os caracteres
        """
        
        text = ''
        for string in value:
            text += f"{string} "
        text = text.strip()
        return text

def condicao(entrada):
    """ 
        Realiza a analise se possui os parenteses e realiza o calculo do mesmo
    """
    # text_list = re.findall(r'(\d+|[\/+*-])',entrada)
    entrada = entrada.replace(' ','')
    valid = re.findall(r'(\d\s?\()',entrada)
    if not valid ==  []:
        raise Exception('Erro Na Sintaxe de Parenteses()')

    if len(re.findall(r'(\()',entrada)) > 1 or len(re.findall(r'(\))',entrada)) > 1:
           raise Exception('Incluso mais de um parenteses')
    
    if '(' in entrada and  ')' in entrada:
        result, value_old = valid_parenteses(entrada)
        if not result:
            raise Exception('Erro Na Sintaxe de Parenteses()')
        else:
            value = format_text(re.findall(r'(\d+|[\/+*-])',result))
            if analisador_sintatico(value):
                result = analise_semantica(value)
                # print(result)
                entrada = entrada.replace(value_old, result)
            
    text_list = format_text(re.findall(r'(\d+|[\/+*-])',entrada))
    return text_list

def valid_parenteses(entrada):
    """
        Validação de parenteses
    """
    entrada = entrada.replace(' ','')
    text = re.findall(r'\(\d+[\/+*-]\d+\)',entrada)
    
    if text == []:
        return False, None

    if '(' in text[0] and  ')' in text[0]:
        value = text[0].replace('(','').replace(')','')

    return value, text[0]

def sintatico_semandtico(text):
    """
        realiza a verificação das analises sintatica e semantica
    """
    resultado_sintatico = analisador_sintatico(text)
    if not resultado_sintatico:
        raise Exception("Erro, programa não compilado.")
    
    resultado_semantico = analise_semantica(text)
    return resultado_semantico

def principal(text):
    """
        Função principal para recebimenta da entrada digitada no fron end
    """
    text = condicao(text)
    resultado = calcule_priory(text)
    eel.renderizefront('return_calcule',f'{resultado}')
    eel.renderizefront('id_valid', 'Programa Compilado')


def calcule_priory(condicao):
    """
        Realiza o Calculos de acordo com as prioridades a mesma se faz recursiva se ouver mais de um operador a calcular
    """
    # multiplicações e divisões e adição e subtração.
    condicao_old = condicao
    condicao = condicao.split()
     

    if '*' in condicao:
        if len(condicao) < 3:
            raise Exception('Variavel de Operador Invalido')
        temp  = f"{condicao[condicao.index('*')-1]} * {condicao[condicao.index('*')+1]}"
        value = sintatico_semandtico(temp)
        condicao_old = condicao_old.replace(temp, value)
        return calcule_priory(condicao_old)
        
    if '/' in condicao:
        if len(condicao) < 3:
            raise Exception('Variavel de Operador Invalido')
        # condicao.index('/')
        temp  = f"{condicao[condicao.index('/')-1]} / {condicao[condicao.index('/')+1]}"
        value = sintatico_semandtico(temp)
        condicao_old = condicao_old.replace(temp, value)
        return calcule_priory(condicao_old)
    
    if '+' in condicao:
        # condicao.index('+')
        if len(condicao) < 3:
            raise Exception('Variavel de Operador Invalido')
         
        temp  = f"{condicao[condicao.index('+')-1]} + {condicao[condicao.index('+')+1]}"
        value = sintatico_semandtico(temp)
        condicao_old = condicao_old.replace(temp, value)
        return calcule_priory(condicao_old)
    
    if '-' in condicao:
        if len(condicao) < 3:
            raise Exception('Variavel de Operador Invalido')
        # condicao.index('-')
        temp  = f"{condicao[condicao.index('-')-1]} - {condicao[condicao.index('-')+1]}"
        value = sintatico_semandtico(temp)
        condicao_old = condicao_old.replace(temp, value)
        return calcule_priory(condicao_old)

    # eel.renderizefront(f'{condicao_old}')
    return condicao_old


if '__main__' in __name__:
    entrada = '5 + 5 * ( 9*9) + 15'
    principal(entrada)