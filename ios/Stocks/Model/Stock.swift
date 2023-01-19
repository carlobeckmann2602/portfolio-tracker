//
//  Stock.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation
import SwiftUI

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
    if histories.count == 0 {
      return Float.nan
    }
    return histories[0].close
  }

  func getArrow() -> String {
    if histories.count == 0 {
      return "questionmark.circle"
    }

    if histories[0].trend > 0 {
      return "arrow.up.circle.fill"
    }
    return "arrow.down.circle.fill"
  }

  func getTrend() -> String {
    if histories.count == 0 {
      return "?"
    }
    return String(format: "%+.2f%%", histories[0].trend)
  }
}
