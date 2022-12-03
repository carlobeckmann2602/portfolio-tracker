//
//  PortfolioStock.swift
//  Stocks
//
//  Created by Carlo Beckmann on 09.11.22.
//

import Foundation

struct PortfolioEntry: Hashable, Codable, Identifiable {
  var id = UUID()
  var stock: Stock
  var amount: Int

  func calculateStockValue() -> Double {
    return (Double)(stock.value * Float(amount))
  }

  func get_amount() -> Int {
    return amount
  }
}
