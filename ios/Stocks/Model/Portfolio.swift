//
//  Portfolio.swift
//  Stocks
//
//  Created by Carlo Beckmann on 09.11.22.
//

import Foundation

class Portfolio: ObservableObject {
  @Published var stocks: [PortfolioEntry]
  var currentPortfolioValue: Float
  var gainAbsolute: Float
  var gainPercentage: Float

  init(
    stocks: [PortfolioEntry], currentPortfolioValue: Float, gainAbsolute: Float,
    gainPercentage: Float
  ) {
    self.stocks = stocks
    self.currentPortfolioValue = currentPortfolioValue
    self.gainAbsolute = gainAbsolute
    self.gainPercentage = gainPercentage
  }

  func isEmpty() -> Bool {
    return stocks.isEmpty
  }

  func addStockToPortfolio(portfolioEntry: PortfolioEntry) {
    var existingEntryIndex = self.stocks.firstIndex(where: {
      $0.stock.id == portfolioEntry.stock.id
    })
    if existingEntryIndex != nil {
      self.stocks[existingEntryIndex!].amountAfterSplit += portfolioEntry.amountAfterSplit
    } else {
      self.stocks.append(portfolioEntry)
    }
    self.stocks = self.stocks
    self.currentPortfolioValue += portfolioEntry.moneyInvestedInStock
  }

  func incrementStockFromPortfolio(stock: Stock) {
    //addStockToPortfolio(stock: stock, amount: 1)
  }

  func decrementStockFromPortfolio(stock: Stock) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      var existingEntryIndex = self.stocks.firstIndex(where: { $0.stock.id == stock.id })
      if existingEntryIndex != nil {
        self.stocks[existingEntryIndex!].amountAfterSplit -= 1
        self.stocks = self.stocks
      }
    }
  }

  func removeAllStockFromPortfolio(stock: Stock) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      var existingEntryIndex = self.stocks.firstIndex(where: { $0.stock.id == stock.id })
      if existingEntryIndex != nil {
        self.stocks[existingEntryIndex!].amountAfterSplit = 0
        self.stocks = self.stocks
      }
    }
  }

}
