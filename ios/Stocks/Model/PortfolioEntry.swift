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
  var amountAfterSplit: Int
  var price: Float
  var trend: Float
  var moneyInvestedInStock: Float
  var gainAbsolute: Float
  var gainPercentage: Float

  func calculateStockValue() -> Double {
    return Double(Double(price) * Double(amountAfterSplit))
  }
}
