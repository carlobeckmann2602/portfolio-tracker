//
//  ContentView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import SwiftUI

struct ContentView: View {
  var body: some View {
    TabView {
      PortfolioView().tabItem { Label("Portfolio", systemImage: "chart.pie") }
      SearchView().tabItem { Label("Search", systemImage: "magnifyingglass") }
    }
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
  }
}
