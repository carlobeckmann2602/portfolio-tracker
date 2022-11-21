//
//  AddToPortfolioView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 19.11.22.
//

import Foundation
import SwiftUI

struct AddToPortfolioView: View {
  var stock: Stock
  var portfolio: Portfolio

  @State var input = "1"
  var body: some View {
    VStack {
      HStack {
        Text("Amount")
        TextField("", text: $input)
          .padding()
          .keyboardType(.decimalPad)
      }
      HStack {
        Text("Money spend")
        Text(String(format: "%.2f€", amountSpend()))
        Spacer()
      }
      Button {
        portfolio.addStockToPortfolio(stock: stock, amount: 1)
        NavigationUtils.popToRootView()
      } label: {
        Text("Add to portfolio")
      }
    }.navigationTitle(stock.name)
  }

  func amountSpend() -> Float {
    return stock.value * (Float(input) ?? 0)
  }
}
