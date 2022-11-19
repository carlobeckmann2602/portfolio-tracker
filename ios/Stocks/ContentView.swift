//
//  ContentView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import SwiftUI

struct ContentView: View {
  var body: some View {
    PortfolioView().tabItem { Label("Portfolio", systemImage: "chart.pie") }
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
  }
}
