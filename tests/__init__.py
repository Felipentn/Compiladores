import re


def valid_parenteses(entrada):
    entrada = entrada.replace(' ','')
    text = re.findall(r'\(\d+[\/+*-]\d+\)',entrada)
    
    if text == []:
        print(False)
        return False

    if '(' in text[0] and  ')' in text[0]:
        text = text[0].replace('(','').replace(')','')
        print(True)
    return text












value = '5 + 5 + (9*9) +2'
value = value.replace(' ','')

result = value.replace('(9*9)','81')
# result  =  valid_parenteses(value)
print(result)
pass

