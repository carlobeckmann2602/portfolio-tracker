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
  var portfolioHandler: PortfolioHandler
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
          if portfolioEntry.trend > 0 {
            Image(systemName: "arrow.up.circle")
              .font(.system(size: 50)).fontWeight(.light)
              .padding(.trailing)
          } else if portfolioEntry.trend < 0 {
            Image(systemName: "arrow.down.circle")
              .font(.system(size: 50)).fontWeight(.light)
              .padding(.trailing)
          } else {
            Image(systemName: "arrow.right.circle")
              .font(.system(size: 50)).fontWeight(.light)
              .padding(.trailing)
          }
          VStack(alignment: .leading, spacing: 5) {
            Text(portfolioEntry.stock.name)
              .roboto(size: 25, weight: .medium)
            Text(
              "+2,45%"
            )
            .roboto(size: 18, weight: .regular)
          }
          Spacer()
          Text(String(format: "%.02f€", portfolioEntry.calculateStockValue())).roboto(
            size: 18, weight: .regular)
        }.padding(20)
      }
      Spacer()
        .frame(height: 2)
      ScrollView(showsIndicators: false) {
        HStack {
          Text("Current price:")
            .roboto(size: 25)
          Spacer()
          Text(String(format: "%.2f€", portfolioEntry.stock.getValue()))
            .roboto(size: 25)
        }
        HStack {
          Text("24h Trend:")
            .roboto(size: 25)
          Spacer()
          Text(portfolioEntry.getTrendPercentageString())
            .roboto(size: 25)
        }
        HStack {
          Text("Gains:")
            .roboto(size: 25)
          Spacer()
          Text(String(format: "%.2f€", portfolioEntry.gainAbsolute))
            .roboto(size: 25, foregroundColor: AppColors.PRIMARY)
        }
        Spacer()
          .padding(.bottom, 10)
        RemoveAllAmount(
          portfolioEntry: portfolioEntry, portfolio: portfolio, portfolioHandler: portfolioHandler)
      }.foregroundColor(Color.white)

    }
  }
  func formatPortfolioProportion() -> String {
    return String(
      format: "%.2f%% of your portfolio",
      normalizedValue(
        portfolioEntry: portfolioEntry, portfolio: self.portfolio)
        * 100)
  }
}
