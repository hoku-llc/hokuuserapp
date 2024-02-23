import json
import websocket
import threading
import requests
import time
from tws_code.IB_manager import set_contract_from_web, IBroker
import signal
class TimeoutException(Exception):
    def __init__(self, *args, **kwargs):
        pass

def signal_handler(signum, frame):
    raise TimeoutException()

signal.signal(signal.SIGALRM, signal_handler)

# WebSocket URL
websocket_url = "ws://9.tcp.ngrok.io:24047"  # Has to match same as EXPRESS.JS
# api_url = "http://localhost:3001/receive_json"
# websocket_url = "ws://localhost:3001"  # Has to match same as EXPRESS.JS
api_url = "https://cattle-unified-inherently.ngrok-free.app/receive_json"
# Global flag to indicate whether to stop the WebSocket thread
stop_websocket_thread = threading.Event()
IB = IBroker()

def run_trade_listener(apiKey: str, tickerConfig: map, dbPath: str):
    stop_websocket_thread.clear()
    def on_message(ws, message):
        # this runs when there is a post request sent to the express websocket
        received_json = json.loads(message)
        if received_json:
            inner_dicts = list(received_json.values())
            latest_entry = max(inner_dicts, key=lambda x: x['timestamp'])
            print("Latest Entry:", latest_entry)
            print(tickerConfig[latest_entry['ticker']])
            print("ticker of entry", latest_entry['ticker'], tickerConfig[latest_entry['ticker']])
            if latest_entry['ticker'] in tickerConfig and tickerConfig[latest_entry['ticker']] > 0:
                print('in entry')
                try:
                    signal.alarm(45)
                    IB.execute_liveTrader(executeObject=latest_entry, contractQuantity=tickerConfig[latest_entry['ticker']], dbPath=dbPath)
                    signal.alarm(0)
                except:
                    print('timeout error')


    def on_open(ws):
        print("WebSocket connection opened.")

    def on_close(ws, close_status_code, close_reason):
        print("WebSocket connection closed with status code:", close_status_code)
        print("Reason:", close_reason)
        # You can add any cleanup or error handling code here

    def on_error(ws, error):
        print("WebSocket error:", error)
        time.sleep(5)  # Wait for 5 seconds before retrying (adjust as needed)
        ws.close()
        websocket_thread = threading.Thread(target=run_websocket)
        websocket_thread.start()

    ws = websocket.WebSocketApp(websocket_url, on_message=on_message, on_open=on_open, keep_running=True, on_close=on_close, on_error=on_error)

    
    def run_websocket():
        ws.run_forever()

    websocket_thread = threading.Thread(target=run_websocket)
    websocket_thread.start()

    def close_websocket():
        ws.close()

    # Run the WebSocket periodically checking the flag
    try:
        while not stop_websocket_thread.is_set():
            time.sleep(1)
        ws.close()
    except KeyboardInterrupt:
        # Close the WebSocket connection when the script is interrupted
        close_websocket()

# Function to stop the WebSocket thread
def stop_trade_listener():
    stop_websocket_thread.set()

def print_mmm():
    print('mmmmmm')
# if __name__ == "__main__":
#     run_trade_listener("hokuWebKey111")