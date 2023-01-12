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
  var searchWasSubmitted: Bool
  var portfolio: Portfolio
  var authenticationHandler: AuthenticationHandler
  @EnvironmentObject var searchState: SearchState

  @Environment(\.dismiss) private var dismiss

  @Environment(\.isSearching)
  private var isSearching: Bool

  var body: some View {
    VStack {
      if searchWasSubmitted {
        AsyncContentView(
          loadable: SearchResultLoader(
            searchHandler: SearchHandler(authenticationHandler: authenticationHandler),
            searchText: searchState.searchText),
          loadingView: StyledProgressSpinner(text: "Searching..")
            .tint(.white)
            .foregroundColor(Color.white)
        ) { stocks in
          SearchResultsList(portfolio: portfolio, stocks: stocks)
        }
      } else {
        VStack {
          Spacer()
          Text("Search a stock by name")
            .roboto(size: 25)
          Spacer()
        }
      }
    }

  }
}

struct AddStocksView: View {
  var portfolio: Portfolio
  var authenticationHandler: AuthenticationHandler
  @StateObject var searchState = SearchState()

  @Environment(\.dismissSearch) private var dismissSearch
  @State var searchWasSubmitted = false

  var body: some View {
    ZStack {
      AppColors.LIGHT_PURPLE.ignoresSafeArea()
      SearchStocksList(
        searchWasSubmitted: searchWasSubmitted, portfolio: portfolio,
        authenticationHandler: authenticationHandler
      )
      .searchable(text: $searchState.searchText, prompt: "Search a stock")
      .onChange(
        of: searchState.searchText,
        perform: { newText in
          searchWasSubmitted = false
        }
      )
      .onSubmit(of: .search) {
        searchWasSubmitted = true
        dismissSearch()
      }
      .environmentObject(
        searchState)
    }
  }
}
