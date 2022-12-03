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
    if portfolioEntry.get_amount() > 0 {
      portfolio.decrementStockFromPortfolio(stock: stock)
    }
  }

  var body: some View {
    HStack {
      Text("Count:")
        .font(.custom("Roboto", size: 25))
        .fontWeight(.light)
      Spacer()
      Button {
        decrementStep()
      } label: {
        Image(systemName: "minus")
      }
      .frame(width: 50, height: 35)
      .foregroundColor(buttonColor)
      .background(AppColors.PRIMARY)
      .cornerRadius(8)
      .padding(5)
      .disabled(portfolioEntry.get_amount() <= 0)
      Text("\(portfolioEntry.get_amount())").font(.custom("Roboto", size: 25))
        .fontWeight(.light)
      Button {
        incrementStep()
      } label: {
        Image(systemName: "plus")
      }
      .frame(width: 50, height: 35)
      .foregroundColor(Color.black)
      .background(AppColors.PRIMARY)
      .cornerRadius(8)
      .padding(5)
    }
  }

  var buttonColor: Color {
    return portfolioEntry.get_amount() <= 0 ? .gray : .black
  }
}
