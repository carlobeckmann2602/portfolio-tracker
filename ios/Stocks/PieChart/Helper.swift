//
//  Helper.swift
//  MyPieChart
//
//  Created by BLCKBIRDS on 07.06.21.
//

import Foundation
import SwiftUI

extension Color {
  init(hex: String) {
    let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    var int: UInt64 = 0
    Scanner(string: hex).scanHexInt64(&int)
    let a: UInt64
    let r: UInt64
    let g: UInt64
    let b: UInt64
    switch hex.count {
    case 3:  // RGB (12-bit)
      (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
    case 6:  // RGB (24-bit)
      (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
    case 8:  // ARGB (32-bit)
      (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
    default:
      (a, r, g, b) = (1, 1, 1, 0)
    }

    self.init(
      .sRGB,
      red: Double(r) / 255,
      green: Double(g) / 255,
      blue: Double(b) / 255,
      opacity: Double(a) / 255
    )
  }
}

let pieColors = [
  Color.init(hex: "#EA4FFF"),
  Color.init(hex: "#5C67FF"),
  Color.init(hex: "#76FCFF"),
  Color.init(hex: "#489CE8"),
  Color.init(hex: "#A410FF"),
  Color.init(hex: "#11F1A6"),
]

func normalizedValue(portfolioEntry: PortfolioEntry, portfolio: Portfolio) -> Double {
  var total: Float = 0.0
  portfolio.stocks.forEach { data in
    total += data.calculateStockValue()
  }

  return Double(portfolioEntry.calculateStockValue() / total)
}

struct PieSlice {
  var startDegree: Double
  var endDegree: Double
}

func angleAtTouchLocation(inPie pieSize: CGRect, touchLocation: CGPoint) -> Double? {
  let dx = touchLocation.x - pieSize.midX
  let dy = touchLocation.y - pieSize.midY

  let distanceToCenter = (dx * dx + dy * dy).squareRoot()
  let radius = pieSize.width / 2
  guard distanceToCenter <= radius else {
    return nil
  }
  let angleAtTouchLocation = Double(atan2(dy, dx) * (180 / .pi))
  if angleAtTouchLocation < 0 {
    return (180 + angleAtTouchLocation) + 180
  } else {
    return angleAtTouchLocation
  }
}
