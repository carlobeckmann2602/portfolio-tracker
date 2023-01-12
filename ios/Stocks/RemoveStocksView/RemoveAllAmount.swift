//
//  remove_all_amount.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.11.22.
//

import Foundation
import SwiftUI

struct RemoveAllAmount: View {
  var portfolioEntry: PortfolioEntry
  var portfolio: Portfolio
  var portfolioHandler: PortfolioHandler

  @State var input = "1"
  var body: some View {
    Button {
      do {
        try portfolioHandler.removeFromPortfolio(
          stockId: portfolioEntry.stock.id, amount: portfolioEntry.amountAfterSplit,
          onComplete: {
            portfolio.removeAllStockFromPortfolio(stock: portfolioEntry.stock)
          })
      } catch {
        print("error when removing from portfolio \(error)")
      }
    } label: {
      Text("Remove all")
        .roboto(size: 20, weight: .medium)
        .frame(maxWidth: .infinity)
        .padding()
        .overlay(
          RoundedRectangle(cornerRadius: 12)
            .stroke(.white, lineWidth: 3)
        ).frame(maxWidth: .infinity)
    }
  }
}
