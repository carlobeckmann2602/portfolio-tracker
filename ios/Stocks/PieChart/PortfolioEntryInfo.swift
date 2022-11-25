//
//  SingleStockInfo.swift
//  Stocks
//
//  Created by Jan Honsbrok on 17.11.22.
//

import Foundation
import SwiftUI

struct PortfolioEntryInfo: View {
  var portfolioEntry: PortfolioEntry
  var portfolio: Portfolio
  var body: some View {
    VStack(alignment: .leading, spacing: 10) {
      HStack {
        Label("", systemImage: "arrow.up.circle.fill")
          .font(.system(size: 60))
          .foregroundColor(Color(hex: "0094ff"))
          .labelStyle(.iconOnly)
        VStack(alignment: .leading, spacing: 5) {
          Text(portfolioEntry.stock.name)
            .font(.system(size: 40))
            .fontWeight(.bold)
          Text(
            formatPortfolioProportion()
          )
          .font(.system(size: 20))
        }
      }
      Spacer()
        .frame(height: 2)
      Text(String(format: "Current price: %.2f€", portfolioEntry.stock.value))
      Text("Trend: +0.76%")
        StepperView()
    }.foregroundColor(Color.white)
  }
  func formatPortfolioProportion() -> String {
    return String(
      format: "%.2f%% of your portfolio",
      normalizedValue(
        portfolioEntry: portfolioEntry, portfolio: self.portfolio)
        * 100)
  }
}

struct PortfolioEntryInfo_Previews: PreviewProvider {
  static var portfolio = Portfolio(stocks: [
    PortfolioEntry(stock: ModelData().stocks[0], amount: 5),
    PortfolioEntry(stock: ModelData().stocks[4], amount: 8),
    PortfolioEntry(stock: ModelData().stocks[22], amount: 15),
  ])
  static var previews: some View {
    VStack {
      PortfolioEntryInfo(
        portfolioEntry: PortfolioEntryInfo_Previews.portfolio.stocks[0], portfolio: portfolio)
    }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.black)
  }
}
