//
//  StockHintList.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation
import SwiftUI

struct SearchResultsList: View {
  var portfolio: Portfolio
  var stocks: [Stock]
  var authenticationHandler: AuthenticationHandler

  var body: some View {
    if stocks.isEmpty {
      VStack {
        Spacer()
        Text("No results found")
          .roboto(size: 25)
        Spacer()
      }
    }
    List(stocks) { stock in
      NavigationLink(
        destination: AddToPortfolioView(
          stock: stock, portfolio: portfolio,
          portfolioHandler: PortfolioHandler(authenticationHandler: authenticationHandler))
      ) {
        StockListCell(stock: stock)
          .padding(5)
      }.listRowBackground(
        RoundedRectangle(cornerRadius: 12)
          .background(.clear)
          .foregroundColor(AppColors.VERY_LIGHT_PURPLE)
          .padding(
            EdgeInsets(
              top: 7,
              leading: 7,
              bottom: 7,
              trailing: 7
            )
          )
      )
      .listRowSeparator(.hidden)
    }.scrollContentBackground(.hidden)
  }
}
