import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.absolute()))

import re
from time import sleep

import eel
import utils


def expose(func):
    """
    Demonstra qualquer erro no front end.
    """

    @eel.expose(func.__name__)
    def inner(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except Exception as ex:
            sleep(1)
            eel.updateStatusBar('')
            eel.closeModal('loading-modal')
            id = ''.join(re.findall('[a-zA-Z]', str(ex)))
            eel.showModal(id, str(ex)[:300])

    return inner


@eel.expose
def show_app_name():
    """Coloca o nome do projeto no Front End."""
    global APP_NAME
    eel.setProjectName(APP_NAME)


def show_app(app_name):
    """Inicializa o App."""
    global APP_NAME
    APP_NAME = app_name
    port = utils.get_avaliable_port(utils.create_port(APP_NAME)) * 10
    eel.init('./web')
    eel.start(
        'index.html',
        size=(800, 500),
        port=port,
        mode='chrome',
        app_mode=False,
        block=False,
    )
    while True:
        eel.sleep(1)
