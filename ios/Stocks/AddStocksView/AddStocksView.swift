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

  var oftenAddedStocksLoader = OftenAddedStocksLoader()

  @Environment(\.isSearching)
  private var isSearching: Bool

  var body: some View {
    if isSearching {
      SearchResultsList(portfolio: portfolio)
    } else {
      AsyncContentView(
        loadable: oftenAddedStocksLoader, loadingView: ProgressView()
      ) { stocks in
        OftenAddedStocksList(portfolio: portfolio)
      }
    }
  }
}

class OftenAddedStocksLoader: LoadableObject {
  @Published private(set) var state = LoadingState<[Stock]>.idle

  func load() {
    state = .loading
    DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
      self.state = .loaded([Stock(id: 1, name: "DemoStock", value: 1)])
    }
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
