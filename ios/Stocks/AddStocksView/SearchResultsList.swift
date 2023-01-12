//
//  StockHintList.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation
import SwiftUI

struct SearchResultsList: View {
  var portfolio: Portfolio
  var stocks: [Stock]
  var body: some View {
    if stocks.isEmpty {
      VStack {
        Spacer()
        Text("No results found")
          .roboto(size: 25)
        Spacer()
      }
    }
    List(stocks) { stock in
      NavigationLink(
        destination: AddToPortfolioView(
          stock: stock, portfolio: portfolio)
      ) {
        StockListCell(stock: stock)
      }
    }
  }
}
