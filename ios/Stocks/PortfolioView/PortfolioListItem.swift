//
//  PortfolioListItem.swift
//  Stocks
//
//  Created by Carlo Beckmann on 09.11.22.
//

import SwiftUI

struct PortfolioListItem: View {
  var portfolioStock: PortfolioEntry
  var body: some View {
    HStack {
      Text(portfolioStock.stock.name)
      Spacer()
      Text(String(format: "Amount: %.2f", portfolioStock.amount))
      Spacer()
      Text(String(format: "Total Value: %.2f€", portfolioStock.stock.value * portfolioStock.amount))
    }
    .padding()
  }
}

struct PortfolioListItem_Previews: PreviewProvider {
  static var previews: some View {
    PortfolioListItem(
      portfolioStock: PortfolioEntry(
        stock: Stock(id: 101, name: "Adidas", value: 120.4), amount: 2.3))
  }
}
