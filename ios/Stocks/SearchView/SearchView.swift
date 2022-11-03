//
//  SearchView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

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
      StockHintList()
    } else {
      StocksList()
    }
  }
}

struct SearchView: View {

  @StateObject var searchState = SearchState()

  var body: some View {
    NavigationView {
      SearchStocksList()
    }.searchable(text: $searchState.searchText, prompt: "Search a stock").environmentObject(
      searchState)
  }
}

struct SearchView_Previews: PreviewProvider {
  static var previews: some View {
    SearchView()
  }
}
