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
      ZStack {
        Rectangle()
          .fill(.white)
          .opacity(0.1)
          .frame(height: 80)
          .overlay(
            RoundedRectangle(cornerRadius: 12)
              .stroke(.blue, lineWidth: 3)
          )
        HStack {
          VStack(alignment: .leading, spacing: 5) {
            Text(portfolioEntry.stock.name)
              .font(.custom("Roboto", size: 25))
              .fontWeight(.medium)
            Text(
              "+2,45%"
            )
            .font(.custom("Roboto", size: 18))
            .fontWeight(.regular)
          }
          Spacer()
          Text(String(format: "%.02f€", portfolioEntry.calculateStockValue())).font(
            .custom("Roboto", size: 18)
          )
          .fontWeight(.regular)
        }.padding(20)
      }
      Spacer()
        .frame(height: 2)
      HStack {
        Text("Current price:")
          .font(.custom("Roboto", size: 25))
          .fontWeight(.light)
        Spacer()
        Text(String(format: "%.2f€", portfolioEntry.stock.value))
          .font(.custom("Roboto", size: 25))
          .fontWeight(.light)
      }
      HStack {
        Text("Trend:")
          .font(.custom("Roboto", size: 25))
          .fontWeight(.light)
        Spacer()
        Text("+2,45%")
          .font(.custom("Roboto", size: 25))
          .fontWeight(.light)
      }
      StepperView(stock: portfolioEntry.stock, portfolio: portfolio, portfolioEntry: portfolioEntry)
      RemoveAllAmount(stock: portfolioEntry.stock, portfolio: portfolio)
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
