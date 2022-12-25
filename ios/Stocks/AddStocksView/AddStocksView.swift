//
//  SearchView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import Combine
import Foundation
import SwiftUI

class SearchState: ObservableObject {
  @Published var searchText = ""
}

struct SearchStocksList: View {
  var portfolio: Portfolio

  @Environment(\.isSearching)
  private var isSearching: Bool

  var body: some View {
    SearchResultsList(portfolio: portfolio)
  }
}

struct AddStocksView: View {

  @StateObject var searchState = SearchState()
  var portfolio: Portfolio

  var body: some View {

    SearchStocksList(portfolio: portfolio)

      .searchable(text: $searchState.searchText, prompt: "Search a stock").environmentObject(
        searchState)
  }
}
