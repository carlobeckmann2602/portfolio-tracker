//
//  StockList.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation
import SwiftUI

struct OftenAddedStocksList: View {
  var portfolio: Portfolio
  var body: some View {
    VStack(alignment: .leading) {
      Text("Often added")
        .padding([.leading, .trailing], 20).padding([.top], 30)
        .fontWeight(.semibold).italic()
      List {
        ForEach(ModelData().stocks) { stock in
          NavigationLink(
            destination: AddToPortfolioView(stock: stock, portfolio: portfolio)
          ) {
            StockListCell(stock: stock)
          }
        }
      }
    }

  }
}
