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
  var gainPercentage: Float?

  func calculateStockValue() -> Double {
    return Double(Double(price) * Double(amountAfterSplit))
  }

  func getGainPercentageString() -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .percent
    formatter.minimumFractionDigits = 2
    formatter.maximumFractionDigits = 2
    formatter.positivePrefix = formatter.plusSign
    formatter.negativePrefix = formatter.minusSign
    return formatter.string(for: (gainPercentage ?? 0.0) / 100.0) ?? "0,00 %"
  }

  func getTrendPercentageString() -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .percent
    formatter.minimumFractionDigits = 2
    formatter.maximumFractionDigits = 2
    formatter.positivePrefix = formatter.plusSign
    formatter.negativePrefix = formatter.minusSign
    return formatter.string(for: trend / 100) ?? "0,00 %"
  }

  func getAbsoluteGainString() -> String {
    let formatter = NumberFormatter()
    formatter.currencySymbol = "€"
    formatter.numberStyle = .currency
    formatter.minimumFractionDigits = 2
    formatter.maximumFractionDigits = 2
    formatter.positivePrefix = formatter.plusSign
    formatter.negativePrefix = formatter.minusSign
    return formatter.string(for: gainAbsolute) ?? "0,00 €"
  }
}
