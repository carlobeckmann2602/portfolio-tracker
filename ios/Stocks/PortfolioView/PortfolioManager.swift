//
//  PortfolioManager.swift
//  Stocks
//
//  Created by Jan Honsbrok on 19.11.22.
//

import Foundation

final class PortfolioManager: ObservableObject {
  @Published var portfolio: Portfolio
  init(portfolio: Portfolio) {
    self.portfolio = portfolio
  }

  func addStockToPortfolio(stock: Stock, amount: Int) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      self.portfolio.stocks.append(PortfolioEntry(stock: stock, amount: (Float)(amount)))
    }
  }
}
