//
//  Stock.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation

struct StockHistory: Hashable, Codable, Identifiable {
  var id: Int
  var stockId: Int
  var split: Int
  var open: Float
  var close: Float
  var high: Float
  var low: Float
  var trend: Float
}

struct Stock: Hashable, Codable, Identifiable {
  var id: Int
  var name: String
  var symbol: String
  var description: String
  var histories: [StockHistory]

  func getValue() -> Float {
    return histories[0].close
  }
}
