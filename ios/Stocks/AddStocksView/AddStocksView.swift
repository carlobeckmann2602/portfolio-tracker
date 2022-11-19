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

  @Environment(\.isSearching)
  private var isSearching: Bool

  var body: some View {
    if isSearching {
      SearchResultsList()
    } else {
      OftenAddedStocksList()
    }
  }
}

class OftenAddedStocksLoader: LoadableObject {
  @Published private(set) var state = LoadingState<[Stock]>.idle

  func load() {
    state = .loading
    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
      self.state = .loaded([Stock(id: 1, name: "DemoStock", value: 1)])
    }
  }
}

struct AddStocksView: View {

  @StateObject var searchState = SearchState()
  var oftenAddedStocksLoader = OftenAddedStocksLoader()

  var body: some View {
    AsyncContentView(
      loadable: oftenAddedStocksLoader, loadingView: ProgressView("loading often added")
    ) { stocks in
      SearchStocksList()
    }
    .searchable(text: $searchState.searchText, prompt: "Search a stock").environmentObject(
      searchState)
  }
}

struct AddStocksView_Previews: PreviewProvider {
  static var previews: some View {
    AddStocksView()
  }
}
