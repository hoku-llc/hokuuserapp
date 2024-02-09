from ibapi.client import *
from ibapi.wrapper import *
# import pandas as pd
from datetime import datetime


class TWSapp(EClient, EWrapper):
    """
    Class representing the IB TWS Web Socket
    parameters:
        command: string to specify command instruction. Ex: ORDER, FUNDS, DATA ...
        params: dict containing objects necessary for each command
        aggDicts: list used to append ochlv data
        df: pandas dataframe for ochlv data.
            Columns: Date(index: datetime), open(float), high(float), low(float), close(float), volume(float)
        positions: dict of {ticker, position_size} position size can be +/-
        availableFunds: float representing total tradable amount in account
    """

    def __init__(self, command: str = '', params: dict = {}):
        EClient.__init__(self, self)
        self.command = command
        self.params = params
        self.aggDicts = []
        # self.df = pd.DataFrame()
        self.positions = {}
        self.availableFunds = 0.0
        self.last_quote = 0.0
        self.margin = 0.0
        self.cont_list = []

    def nextValidId(self, orderId: int):
        """
        runs when TWSapp.run() is called
        Calls instruction based on self.command
        """
        self.reset_values()
        if self.command == 'DATA':
            self.reqHistoricalData(reqId=orderId, contract=self.params['contract'], endDateTime=self.params['endtime'],
                                   durationStr=f"{self.params['duration']} S", barSizeSetting='1 min',
                                   whatToShow='TRADES', useRTH=0, formatDate=1, keepUpToDate=0, chartOptions=[])
        elif self.command == 'CLOSE':
            self.placeOrder(orderId, self.params['contract'], self.params['order'])
        elif self.command == 'ORDER':
            bracket = self.BracketOrder(parentOrderId=orderId, stopLossPercent=0.02, parentOrder=self.params['order'])
            for o in bracket:
                self.placeOrder(o.orderId, self.params['contract'], o)
        elif self.command == 'POSITION':
            self.reqPositions()
        elif self.command == 'FUNDS':
            self.reqAccountSummary(orderId, "All", "AvailableFunds")
        elif self.command == 'HISTORICAL':
            self.reqHistoricalData(reqId=orderId, contract=self.params['contract'], endDateTime=self.params['endtime'],
                                   durationStr=f"{self.params['duration']} W", barSizeSetting='1 min',
                                   whatToShow='TRADES', useRTH=0, formatDate=1, keepUpToDate=0, chartOptions=[])
        elif self.command == 'QUOTE':
            self.reqMarketDataType(1)
            self.reqMktData(orderId, self.params['contract'], "", 0, 0, [])
        elif self.command == 'REQ':
            self.reqContractDetails(4444, self.params['contract'])

    def historicalData(self, reqId: int, bar: BarData):
        """
        appends bars of ochlv data to self.aggDicts
        """
        self.aggDicts.append(vars(bar))

    def contractDetails(self, reqId: int, contractDetails: ContractDetails):
        """
        runs from reqContractDetails
        places order from specified contract and order
        """
        print('yooo')
        self.placeOrder(reqId, contractDetails.contract, self.params['order'])

    def openOrder(self, orderId: OrderId, contract: Contract, order: Order,
                  orderState: OrderState):
        """
        runs from placeOrder and after order is placed
        disconnects from app
        """
        print(f'openOrder orderID: {orderId}, contract: {contract}, order: {order}')
        self.margin = float(orderState.initMarginChange)
        self.disconnect()

    def accountSummary(self, reqId: int, account: str, tag: str, value: str,
                       currency: str):
        """
        runs from reqAccountSummary
        sets self.availableFunds to value of available funds in account
        disconnects from app
        """
        self.availableFunds = float(value)
        self.disconnect()

    def position(self, account: str, contract: Contract, position: float,
                 avgCost: float):
        """
        runs from reqPositions
        sets self.positions to all open positions
        disconnects from app
        """
        print(account, contract.symbol, position, avgCost)
        self.positions[contract.symbol] = position
        self.disconnect()

    def contractDetails(self, reqId, contractDetails):
        """
        runs from reqContractDetails
        sets self.cont_list to have all contracts of a given ticker
        """
        print(reqId, contractDetails.contract.localSymbol)  # my version doesnt use summary
        self.cont_list.append(contractDetails.contract)

    def contractDetailsEnd(self, reqId):
        """
        Runs when reqContractDetails is finished running and disconnects from the app
        """
        print("ContractDetailsEnd. ", reqId)
        self.disconnect()  # delete if threading and you want to stay connected

    def tickPrice(self, reqId, tickType, price, attrib):
        if TickTypeEnum.to_str(tickType) == 'LAST':
            self.last_quote = float(price)
            print(
                f"tickPrice. reqId: {reqId}, tickType: {TickTypeEnum.to_str(tickType)}, price: {price}, attribs: {attrib}")
            self.disconnect()

    def reset_values(self):
        """
        Resets all self values in the app to avoid memory issues
        """
        self.aggDicts = []
        self.df = None
        self.positions = {}
        self.availableFunds = 0
        self.last_quote = 0

    def BracketOrder(self, parentOrderId: int, stopLossPercent: float, parentOrder: Order):
        parentOrder.orderId = parentOrderId
        parentOrder.transmit = False
        stopLoss = Order()
        stopLoss.orderId = (parentOrderId + 1) * 100
        stopLoss.action = "SELL" if parentOrder.action == "BUY" else "BUY"
        stopLoss.orderType = "STP"
        stopLoss.auxPrice = parentOrder.lmtPrice * (
            (1 - stopLossPercent) if parentOrder.action == "BUY" else (1 + stopLossPercent))
        stopLoss.totalQuantity = parentOrder.totalQuantity
        stopLoss.parentId = parentOrderId
        stopLoss.eTradeOnly = ''
        stopLoss.firmQuoteOnly = ''
        stopLoss.transmit = True
        return [parentOrder, stopLoss]