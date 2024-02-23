import re
import json
import signal
import time
class TimeoutException(Exception):
    def __init__(self, *args, **kwargs):
        pass

def signal_handler(signum, frame):
    raise TimeoutException()

signal.signal(signal.SIGALRM, signal_handler)

try:
    signal.alarm(10)
    time.sleep(2)
    print('workewd')
    signal.alarm(0)
except Exception as error:
    print(error)


