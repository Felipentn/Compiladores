import py_front
import bll

@py_front.expose
def main_funtion(text):
    """
    """
    bll.principal(text)
    

py_front.show_app('Compilador')
