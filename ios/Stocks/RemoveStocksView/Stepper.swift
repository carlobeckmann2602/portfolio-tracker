//
//  Stepper.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.11.22.
//

import Foundation
import SwiftUI

struct StepperView: View {
  var stock: Stock
  var portfolio: Portfolio
  var portfolioEntry: PortfolioEntry

  func incrementStep() {
    portfolio.incrementStockFromPortfolio(stock: stock)
  }

  func decrementStep() {
    if portfolioEntry.amountAfterSplit > 0 {
      portfolio.decrementStockFromPortfolio(stock: stock)
    }
  }

  var body: some View {
    HStack {
      Text("Count:")
        .roboto(size: 25)
      Spacer()
      Button {
        decrementStep()
      } label: {
        Image(systemName: "minus")
          .frame(width: 50, height: 35)
      }
      .foregroundColor(buttonColor)
      .background(AppColors.PRIMARY)
      .cornerRadius(8)
      .padding(5)
      .disabled(portfolioEntry.amountAfterSplit <= 0)
      Text("\(portfolioEntry.amountAfterSplit)")
        .roboto(size: 25)
      Button {
        incrementStep()
      } label: {
        Image(systemName: "plus")
          .frame(width: 50, height: 35)
      }
      .foregroundColor(Color.black)
      .background(AppColors.PRIMARY)
      .cornerRadius(8)
      .padding(5)
    }
  }

  var buttonColor: Color {
    return portfolioEntry.amountAfterSplit <= 0 ? .gray : .black
  }
}
