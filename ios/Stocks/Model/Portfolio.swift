//
//  Portfolio.swift
//  Stocks
//
//  Created by Carlo Beckmann on 09.11.22.
//

import Foundation

struct Portfolio {
  var stocks: [PortfolioEntry]

  func totalValue() -> Double {
    return stocks.map { $0.calculateStockValue() }.reduce(0, +)
  }

  func isEmpty() -> Bool {
    return stocks.isEmpty
  }
}
