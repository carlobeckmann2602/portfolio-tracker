//
//  StockHintList.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation
import SwiftUI

struct StockHintListCell: View {
  var stock: Stock
  var body: some View {
    HStack {
      Image(systemName: "plus.circle")
      Text(stock.name)
    }
  }
}

func filterStocks(text: String) -> [Stock] {
  return STOCKS_IN_DAX.filter({ stock in
    return !text.isEmpty && stock.name.lowercased().starts(with: text.lowercased())
  })
}

struct StockHintList: View {
  @EnvironmentObject var searchState: SearchState
  var body: some View {
    List {
      ForEach(filterStocks(text: searchState.searchText)) { stock in
        StockHintListCell(stock: stock)
      }
    }
  }
}
