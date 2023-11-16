import os
import platform
import socket
from contextlib import closing
from string import ascii_letters, digits, punctuation
from unicodedata import normalize


def create_port(project_name: str):
    """Cria um número de porta baseada no nome do projeto."""
    caracteres = ascii_letters + digits + punctuation + ' '
    port = sum(
        [
            caracteres.index(
                normalize('NFKD', letter)
                .encode('ASCII', 'ignore')
                .decode('utf-8')
            )
            for letter in project_name
        ]
    )
    return port


def open_output_folder(folder):
    """Abra uma pasta no explorador de arquivos local."""
    folder_directory = os.path.abspath(folder)
    if platform.system() == 'Windows':
        os.startfile(folder_directory, 'explore')
    elif platform.system() == 'Linux':
        os.system('xdg-open "' + folder_directory + '"')
    elif platform.system() == 'Darwin':
        os.system('open "' + folder_directory + '"')
    else:
        return False
    return True


def get_avaliable_port(port=8000):
    """Obtenha uma porta disponível iniciando um novo servidor, parando e retornando a porta."""
    while check_socket('localhost', port):
        port += 1
    return port


def check_socket(host, port):
    """Valida se o host e a porta estão disponiveis para uso."""
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        if sock.connect_ex((host, port)) == 0:
            return True
        else:
            return False
