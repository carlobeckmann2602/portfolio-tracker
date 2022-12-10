//
//  remove_all_amount.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.11.22.
//

import Foundation
import SwiftUI

struct RemoveAllAmount: View {
  var stock: Stock
  var portfolio: Portfolio

  @State var input = "1"
  var body: some View {
    Button {
      portfolio.removeAllStockFromPortfolio(stock: stock)
    } label: {
      Text("Remove all")
        .roboto(size: 20, weight: .medium)
        .padding()
        .overlay(
          RoundedRectangle(cornerRadius: 12)
            .stroke(.white, lineWidth: 3)
        ).frame(maxWidth: .infinity)
    }
  }
}
