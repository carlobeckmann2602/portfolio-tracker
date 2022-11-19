//
//  StockHintList.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation
import SwiftUI

func filterStocks(text: String) -> [Stock] {
  return ModelData().stocks.filter({ stock in
    return !text.isEmpty && stock.name.lowercased().starts(with: text.lowercased())
  })
}

struct SearchResultsList: View {
  @EnvironmentObject var searchState: SearchState
  var body: some View {
    List {
      ForEach(filterStocks(text: searchState.searchText)) { stock in
        NavigationLink(destination: Text("Add \(stock.name) to your portfolio")) {
          StockListCell(stock: stock)
        }
      }
    }
  }
}
