//
//  remove_all_amount.swift
//  Stocks
//
//  Created by Lucia Auburger on 25.11.22.
//

import Foundation
import SwiftUI

struct RemoveAllAmount: View {
  var portfolioEntry: PortfolioEntry
  var portfolio: Portfolio
  var portfolioHandler: PortfolioHandler

  @State private var showingPopover = false

  @State var input = "1"
  var body: some View {
    Button {
      showingPopover = true
    } label: {
      Text("Remove all")
        .roboto(size: 20, weight: .medium)
        .frame(maxWidth: .infinity)
        .padding()
        .overlay(
          RoundedRectangle(cornerRadius: 12)
            .stroke(.white, lineWidth: 3)
        )
    }
    .popover(isPresented: $showingPopover) {
      RemovePopover(
        stockName: portfolioEntry.stock.name, portfolioEntry: portfolioEntry, portfolio: portfolio,
        portfolioHandler: portfolioHandler, showingPopover: $showingPopover)
    }
  }
}
