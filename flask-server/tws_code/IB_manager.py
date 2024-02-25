import time
import signal
import json
from tinydb import TinyDB, Query
from ibapi.wrapper import *
from datetime import datetime, timedelta
from tws_code.IB_TWS import TWSapp
class TimeoutException(Exception):
    def __init__(self, *args, **kwargs):
        pass

def signal_handler(signum, frame):
    raise TimeoutException()

signal.signal(signal.SIGABRT, signal_handler)

def liveTickerRead():
    with open('../HokuLocalUI/src/data/hokuData.js', 'r') as file:
        data = file.read()
    start_index = data.index('{')
    end_index = data.rindex('}') + 1
    json_data = data[start_index:end_index]
    json_data = json_data.replace("'", '"')
    json_array_string = f'[{json_data.strip().strip(",")}]'
    json_array_string = json_array_string.replace('\n', '').replace('    ', '')
    parsed_data = json.loads(json_array_string)
    return (parsed_data)

liveTickerArray = liveTickerRead()


class IBroker(object):
    """
    Class representing all IB TWS functions
    """
    def __init__(self):
        self.app = TWSapp()
        self.futures_local_symbols = ['F', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'U', 'V', 'X', 'Z']
        self.contract = None
        self.buyTime = datetime.now()
        self.inTrade = False
        self.tradingTicker = ''
        self.quotePrice = 0

    def execute_liveTrader(self, executeObject: map, contractQuantity: int, dbPath: str):
        """
        parameters:
            decision: string representing either "BUY" "SELL" a contract
            current_price: float representing most recent price of contract
        Calls IB TWS and creates an order
        """
        
        contract = set_contract_from_web(contractParam=executeObject['ibContract'])
        if executeObject['action'] == 'BUY' and self.inTrade == False:
            position = 'BUY' if executeObject['position'] == 'Long' else 'SELL' # BUY if long, SELL is short
            order = self.create_limit_order(decision=position, quantity=contractQuantity, limitPrice=executeObject['quotePrice'], whatIf=False)
            order_params = {'contract': contract, 'order': order}
            print('order params', order_params)
            time.sleep(2)
            self.app.connect('127.0.0.1', 7497, 1000)
            self.app.command = 'ORDER'
            self.app.params = order_params
            self.app.run()
            print('self', self.app.trade_success)
            self.inTrade = True
            self.tradingTicker = executeObject['ticker']
            self.buyTime = datetime.now()
            self.quotePrice = executeObject['quotePrice']
            print('BOUGHT STOCK')
        elif (executeObject['action'] =='SELL') and (self.inTrade):
            # open_positions = {'YM': 5, 'ES': 12, 'ZC': 2, 'ZN': 0}#self.get_open_positions()
            time.sleep(1)
            if (executeObject['ticker'] == self.tradingTicker):
                position = 'SELL' if executeObject['position'] == 'Long' else 'BUY' # SELL if in long, BUY if in short
                order = self.create_limit_order(decision=position, quantity=contractQuantity, limitPrice=executeObject['quotePrice'], whatIf=False)
                order_params = {'contract': contract, 'order': order}
                print('order params', order_params)
                if executeObject['position'] == 'Long':
                    # Was a long order
                    profitVal = executeObject['quotePrice'] - self.quotePrice
                else:
                    # Was a short order
                    profitVal = self.quotePrice - executeObject['quotePrice']
                self.app.connect('127.0.0.1', 7497, 1000)
                self.app.command = 'CLOSE'
                self.app.params = order_params
                self.app.run()
                print('self', self.app.trade_success)
                units_per_contract = next((item['units'] for item in liveTickerArray if item['title'] == executeObject['ticker']), None)
                profitVal = profitVal*units_per_contract*contractQuantity
                db = TinyDB(dbPath)
                transactionCollection = db.table('transactions')
                transaction_data = {
                    'timestamp': datetime.utcnow().strftime("%m/%d/%Y, %H:%M:%SZ"),
                    'duration': int((datetime.now() - self.buyTime).total_seconds() / 60),
                    'position': executeObject['position'],
                    'profit': profitVal,  # Change the profit value
                    'ticker': executeObject['ticker'],
                    'numberContracts': contractQuantity
                }
                transactionCollection.insert(transaction_data)
                db.close()
                self.inTrade = False
                self.tradingTicker = ''
                print("SOLD STOCK")

    def check_available_funds(self) -> float:
        """
        Calls IB TWS and returns float representing all available funds in account
        """
        signal.alarm(10)
        self.app.connect('127.0.0.1', 7497, 1000)
        self.app.command = 'FUNDS'
        self.app.run()
        signal.alarm(0)
        return self.app.availableFunds

    def get_open_positions(self) -> list:
        """
        Calls IB TWS to return dict of {ticker: postion_size}
        """
        try:
            signal.alarm(2)
            self.app.connect('127.0.0.1', 7497, 1000)
            self.app.command = 'POSITION'
            self.app.run()
            signal.alarm(0)
            position_dict = self.app.positions
            position_dict = {key: value for key, value in position_dict.items() if value != 0}
            return position_dict
        except:
            print('no position')
            return {}

    @staticmethod
    def create_limit_order(decision: str, quantity: int, limitPrice: float, whatIf: bool) -> Order:
        """
        parameters:
            decision: string representing either "BUY" "SELL" a contract
            quantity: int representing how many of the contract to buy
            whatIf: bool to determine if we are checking for margin or actual order
        returns IB Order object for a market order with specified parameters
        """
        my_order = Order()
        my_order.orderType = "LMT"
        my_order.totalQuantity = quantity
        my_order.lmtPrice = limitPrice
        my_order.action = decision
        my_order.eTradeOnly = ''
        my_order.firmQuoteOnly = ''
        my_order.whatIf = whatIf
        return my_order
    def set_contract(self, ticker: str, exchange: str, day: datetime):
        """
        parameters:
            ticker: string representing ticker
            day: datetime representing current day
        Sets self.contract object to specified contract for the ticker and day
        """
        contract = Contract()
        contract.symbol = ticker
        contract.secType = "FUT"
        contract.exchange = exchange
        contract.currency = "USD"
        contract.includeExpired = False
        req_params = {'contract': contract}
        self.app.connect('127.0.0.1', 7497, 1000)
        self.app.command = 'REQ'
        self.app.params = req_params
        self.app.run()
        cont_list = sorted(self.app.cont_list, key=lambda contract: contract.lastTradeDateOrContractMonth)
        dt = datetime.strptime(cont_list[0].lastTradeDateOrContractMonth, '%Y%m%d')
        contract_enddate = (dt - timedelta(days=7))
        if day > contract_enddate:
            self.contract = cont_list[1]
        else:
            self.contract = cont_list[0]

def set_contract_from_web(contractParam: Contract):
    contract = Contract()
    contract.symbol = contractParam['symbol']
    contract.secType = contractParam['secType']
    contract.lastTradeDateOrContractMonth = contractParam['lastTradeDateOrContractMonth']
    contract.multiplier = contractParam['multiplier']
    contract.exchange = contractParam['exchange']
    contract.currency = contractParam['currency']
    contract.localSymbol = contractParam['localSymbol']
    contract.tradingClass = contractParam['tradingClass']
    contract.includeExpired = contractParam['includeExpired']
    return contract




if __name__ == '__main__':
    IB = IBroker()
    IB.set_contract(ticker='ZN', day=datetime(2024, 2, 13), exchange="CBOT")
    print(IB.contract)
    myContract = {
        'symbol': IB.contract.symbol,
        'secType': IB.contract.secType,
        'lastTradeDateOrContractMonth': IB.contract.lastTradeDateOrContractMonth,
        'multiplier': IB.contract.multiplier,
        'exchange': IB.contract.exchange,
        'currency': IB.contract.currency,
        'localSymbol': IB.contract.localSymbol,
        'tradingClass': IB.contract.tradingClass,
        'includeExpired': IB.contract.includeExpired,
    }
    json_data = {
        'ticker': 'ZN',
        'position': 'Long',
        'action': 'SELL',
        'cDate': IB.contract.localSymbol,
        'timestamp': datetime.utcnow().strftime("%m/%d/%Y, %H:%M:%SZ"),
        'ibContract': myContract,
        'quotePrice': 109.625
    }

    IB.execute_liveTrader(executeObject=json_data, contractQuantity=1, dbPath='/home/hoku-analytics/GITROOT/hoku_userapp/hokuuserapp/flask-server/userData/mydb.json')
    # IB.init_dataframe(ticker='MES', end_day=datetime(2023, 7, 8), start_day=datetime(2023, 3, 8))