from flask import Flask, request, jsonify
import os
from listener import run_trade_listener, stop_trade_listener
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad,unpad
from tinydb import TinyDB, Query
import json
app = Flask(__name__)

#Members API route

configFileName = "./userData/configFile.txt"
dbPath = './userData/mydb.json'
decryptKey = 'HOKUHOKUHOKUHOKU'
in_live = False

@app.route("/startLive")
def startLive():
    global in_live
    print('running trade')
    in_live = True
    apiKey, tickers = readInConfig()
    run_trade_listener(apiKey=apiKey, tickerConfig=tickers, dbPath=dbPath)
    return {}

@app.route("/stopLive")
def stopLive():
    global in_live
    stop_trade_listener()
    in_live = False
    return {}

@app.route("/checkLive")
def checkLive():
    return {"inLive": in_live}

@app.route("/checkconfig")
def checkFile():
    file_name = configFileName
    file_path = os.path.join(os.getcwd(), file_name)
    file_exists = os.path.exists(file_path)
    tickers = {}
    if file_exists:
        apiKey, tickers = readInConfig()

    return jsonify({'file_exists': file_exists, 'tickerJson': tickers, 'apiKey': apiKey})

@app.route("/saveconfig", methods=["POST"])
def saveconfig():
    try:
        encrypted_str = request.json.get("encryptedStr")
        print(encrypted_str)
        file_path = os.path.join(os.path.dirname(__file__),configFileName)
        with open(file_path, "w") as file:
            file.write(encrypted_str)

        return jsonify({"status": "success", "message": "File saved successfully"})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "fail", "message": "Failed to save file"})
    
@app.route("/readDB")
def readDB():
    abs_db_path = os.path.join(os.getcwd(), dbPath)
    db_exists = os.path.exists(abs_db_path)
    if db_exists:
        db = TinyDB(dbPath)
        transactionCollection = db.table('transactions')
        result = transactionCollection.all()
        for transaction in result:
            transaction['id'] = transaction.doc_id
        return jsonify({'success': True, 'docs': result})
    return jsonify({'success': False, 'docs': []})
    
def readInConfig():
    key = decryptKey
    with open(configFileName, 'r') as file:
        data = file.read()
    enc = base64.b64decode(data)
    cipher = AES.new(key.encode('utf-8'), AES.MODE_ECB)
    decoded = (unpad(cipher.decrypt(enc),16).decode("utf-8", "ignore"))
    _, _, apiKey, tickerDict = map(str.strip, decoded.split('|'))
    tickers = json.loads(tickerDict)
    return apiKey, tickers
    

if __name__ == "__main__":
    app.run(port=8000, debug=True)
    # db = TinyDB(dbPath)
    # transactionCollection = db.table('transactions')
    # # fillTinyDB()
    # Trans = Query()
    # result = transactionCollection.search(Trans.ticker == 'ES')
    # print(len(result))
    # db.close()

